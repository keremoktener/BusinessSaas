package com.businessapi.service;

import com.businessapi.RabbitMQ.Model.*;
import com.businessapi.dto.requestDTOs.*;
import com.businessapi.dto.responseDTOs.GetAllUsersResponseDTO;
import com.businessapi.dto.responseDTOs.GetUserInformationDTO;
import com.businessapi.dto.responseDTOs.PageableUserListResponseDTO;
import com.businessapi.entity.Role;
import com.businessapi.entity.User;
import com.businessapi.entity.enums.EStatus;
import com.businessapi.exception.ErrorType;
import com.businessapi.exception.UserException;
import com.businessapi.mapper.UserMapper;
import com.businessapi.repository.UserRepository;
import com.businessapi.util.JwtTokenManager;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;
    private final RoleService roleService;
    private final RabbitTemplate rabbitTemplate;
    private final JwtTokenManager jwtTokenManager;

    /**
     * Kullanıcıyı ID'sine göre arar.
     *
     * @param id Kullanıcı ID'si
     * @return User nesnesi
     * @throws UserException Kullanıcı bulunamadığında fırlatılır
     */
    public User findUserById(Long id) {
        return userRepository.findById(id).orElseThrow(()->new UserException(ErrorType.USER_NOT_FOUND));
    }

    /**
     * Auth ID'sine göre kullanıcıyı bulur.
     *
     * @param authId Kullanıcının Auth ID'si
     * @return User nesnesi
     * @throws UserException Kullanıcı bulunamadığında fırlatılır
     */
    public User findByAuthId(Long authId) {
        return userRepository.findByAuthId(authId).orElseThrow(()->new UserException(ErrorType.USER_NOT_FOUND));
    }


    /**
     * Verilen bilgileri kullanarak yeni bir kullanıcı oluşturur ve kaydeder.
     *
     * @param userSaveRequestDTO Yeni kullanıcı bilgilerini içeren DTO
     */
    @Transactional
    public void saveUser(UserSaveRequestDTO userSaveRequestDTO) {
        User user = UserMapper.INSTANCE.userSaveRequestDTOToUser(userSaveRequestDTO);
        if(!userSaveRequestDTO.roleIds().isEmpty()){
            List<Role> usersRoles = roleService.getRolesByRoleId(userSaveRequestDTO.roleIds());
            user.setRole(usersRoles);
        }else {
            user.setRole(new ArrayList<>());
        }

        user.setStatus(EStatus.ACTIVE);

        Long authId =(Long) rabbitTemplate.convertSendAndReceive("businessDirectExchange", "keySaveAuthFromUser", SaveAuthFromUserModel.builder().email(userSaveRequestDTO.email()).password(userSaveRequestDTO.password()).build());
        user.setAuthId(authId);

        userRepository.save(user);
        isUserCustomer(user);
    }



    /**
     * Diğer servislerden gelen kullanıcıyı kaydeder.
     *
     * @param saveUserFromOtherServicesModel Diğer servislerden gelen kullanıcı bilgileri
     * @return authId Kullanıcının kimlik ID'si
     */
    @RabbitListener(queues = "queueSaveUserFromOtherServices")
    public Long saveUserFromOtherServices(SaveUserFromOtherServicesModel saveUserFromOtherServicesModel) {
        User user = UserMapper.INSTANCE.saveUserFromOtherServicesToUser(saveUserFromOtherServicesModel);
        List<Role> userRoles = new ArrayList<>();
        if(!(roleService.checkIfRoleExistsByRoleName(saveUserFromOtherServicesModel.getRole()))){
            Role role = roleService.saveRole(Role.builder().roleName(saveUserFromOtherServicesModel.getRole().toUpperCase()).build());
            userRoles.add(role);
            user.setRole(userRoles);
        } else{
            Role role = roleService.findByRoleName(saveUserFromOtherServicesModel.getRole());
            userRoles.add(role);
            user.setRole(userRoles);
        }
        user.setStatus(EStatus.ACTIVE);
        Long authId =(Long) rabbitTemplate.convertSendAndReceive("businessDirectExchange", "keySaveAuthFromUser", SaveAuthFromUserModel.builder().email(saveUserFromOtherServicesModel.getEmail()).password(saveUserFromOtherServicesModel.getPassword()).build());
        user.setAuthId(authId);
        userRepository.save(user);
        return authId;
    }




    /**
     * Verilen ID'ye sahip kullanıcıyı siler ve durumunu günceller.
     *
     * @param userDeleteRequestDTO Silinecek kullanıcı bilgilerini içeren DTO
     */
    public void deleteUser(UserDeleteRequestDTO userDeleteRequestDTO) {
        User user = userRepository.findById(userDeleteRequestDTO.userId()).orElseThrow(() -> new UserException(ErrorType.USER_NOT_FOUND));
        user.setStatus(EStatus.DELETED);

        rabbitTemplate.convertAndSend("businessDirectExchange","keyDeleteAuth", user.getAuthId());
        userRepository.save(user);
    }


    /**
     * Kullanıcı bilgilerini günceller.
     *
     * @param userUpdateRequestDTO Güncellenmiş kullanıcı bilgilerini içeren DTO
     */
    @Transactional
    public void updateUser(UserUpdateRequestDTO userUpdateRequestDTO) {
        User user = userRepository.findByAuthId(userUpdateRequestDTO.authId()).orElseThrow(() -> new UserException(ErrorType.USER_NOT_FOUND));

        boolean isEmailExist = (boolean) rabbitTemplate.convertSendAndReceive("businessDirectExchange", "keyCheckEmailExists", userUpdateRequestDTO.email());
        if(isEmailExist){
            throw new UserException(ErrorType.EMAIL_ALREADY_TAKEN);
        }

        if(!user.getFirstName().equals(userUpdateRequestDTO.firstName())){
            user.setFirstName(userUpdateRequestDTO.firstName());
        }
        if(!user.getLastName().equals(userUpdateRequestDTO.lastName())){
            user.setLastName(userUpdateRequestDTO.lastName());
        }

        sendUserMailToAuthService(AuthMailUpdateFromUser.builder().authId(user.getAuthId()).email(userUpdateRequestDTO.email()).build());
        userRepository.save(user);
    }

    /**
     * Auth servisinde kullanıcı e-posta adresini günceller.
     *
     * @param authMailUpdateFromUser E-posta güncelleme bilgilerini içeren model
     */

    private void sendUserMailToAuthService(AuthMailUpdateFromUser authMailUpdateFromUser) {
        rabbitTemplate.convertAndSend("businessDirectExchange","keyAuthMailUpdateFromUser", authMailUpdateFromUser);
    }


    /**
     * Auth servisinden gelen kullanıcıyı kaydeder.
     *
     * @param saveUserFromAuthModel Auth servisinden gelen kullanıcı bilgileri
     */

    @Transactional
    public void saveUserFromAuthService(SaveUserFromAuthModel saveUserFromAuthModel){
        List<Role> usersRoles = new ArrayList<>();
        usersRoles.add(roleService.getRoleById(3L)); //MEMBER rol olarak kaydedilir.
        User user = User.builder()
                .authId(saveUserFromAuthModel.getAuthId())
                .firstName(saveUserFromAuthModel.getFirstName())
                .lastName(saveUserFromAuthModel.getLastName())
                .status(EStatus.PENDING)
                .role(usersRoles)
                .build();
        userRepository.save(user);
    }

    /**
     * Auth servisinden gelen kullanıcı kaydetme isteğini dinler.
     *
     * @param saveUserFromAuthModel Auth servisinden gelen kullanıcı bilgileri
     */
    @RabbitListener(queues = "queueSaveUserFromAuth")
    private void listenAndSaveUserFromAuthService(SaveUserFromAuthModel saveUserFromAuthModel){
        saveUserFromAuthService(saveUserFromAuthModel);
    }

    /**
     * Tüm kullanıcıların listesini döner.
     *
     * @return Kullanıcı bilgilerini içeren DTO listesi
     */
    public List<GetAllUsersResponseDTO> getAllUser() {
        List<User> allUsersList = userRepository.findAll();
        allUsersList = allUsersList.stream()
                .filter(user -> user.getRole().stream().noneMatch(role -> role.getRoleName().equals("SUPER_ADMIN")))
                .toList();

        List<GetAllUsersResponseDTO> allUsersResponseDTOList = new ArrayList<>();

       allUsersList.forEach(user -> {
           List<String> userRolesString = user.getRole().stream().map(Role::getRoleName).toList();
           String usersMail = (String) rabbitTemplate.convertSendAndReceive("businessDirectExchange","keyGetMailByAuthId", user.getAuthId());
           allUsersResponseDTOList.add(GetAllUsersResponseDTO.builder()
                   .id(user.getId())
                   .firstName(user.getFirstName())
                   .lastName(user.getLastName())
                   .email(usersMail)
                   .status(user.getStatus())
                   .userRoles(userRolesString)
                   .build());
       });


        return allUsersResponseDTOList;
    }

    /**
     * Sayfalı kullanıcı listesini döner.
     *
     * @param pageRequestDTO Sayfa numarası ve boyut bilgilerini içeren DTO
     * @return Sayfalı kullanıcı listesi ve toplam eleman sayısı
     */
    public PageableUserListResponseDTO pageableGettAll(PageRequestDTO pageRequestDTO) {
        Pageable pageable = PageRequest.of(pageRequestDTO.page(), pageRequestDTO.size());
        Page<User> userPage = userRepository.findAllByLastNameContainingIgnoreCaseExcludingSuperAdmin(pageRequestDTO.searchText(),pageable);

        List<GetAllUsersResponseDTO> allUsersResponseDTOList = userPage.getContent().stream()
                //.filter(user -> user.getRole().stream().noneMatch(role -> role.getRoleName().equals("SUPER_ADMIN")))
                .map(user -> {
                    List<String> userRolesString = user.getRole().stream().map(Role::getRoleName).toList();
                    String usersMail = (String) rabbitTemplate.convertSendAndReceive("businessDirectExchange", "keyGetMailByAuthId", user.getAuthId());
                    return GetAllUsersResponseDTO.builder()
                            .id(user.getId())
                            .firstName(user.getFirstName())
                            .lastName(user.getLastName())
                            .email(usersMail)
                            .status(user.getStatus())
                            .userRoles(userRolesString)
                            .build();
                })
                .toList();
        return PageableUserListResponseDTO.builder().userList(allUsersResponseDTOList).totalElements(userPage.getTotalElements()).currentPage(userPage.getNumber()).totalPages(userPage.getTotalPages()).build();
    }




    /**
     * Kullanıcıya rol ekler.
     *
     * @param addRoleToUserRequestDTO Rol ekleme isteği bilgilerini içeren DTO
     */
    public void addRoleToUser(AddRoleToUserRequestDTO addRoleToUserRequestDTO) {
        User user = userRepository.findById(addRoleToUserRequestDTO.userId()).orElseThrow(() -> new UserException(ErrorType.USER_NOT_FOUND));
        Role roleById = roleService.getRoleById(addRoleToUserRequestDTO.roleId());
        user.getRole().add(roleById);
        isUserCustomer(user);
        userRepository.save(user);

    }
    /**
     * Kullanıcının müşteri olup olmadığını kontrol eder ve ilgili bilgileri kaydeder.
     *
     * @param user Kontrol edilecek kullanıcı
     */
    private void isUserCustomer(User user) {
        user.getRole().forEach(role -> {
            if(role.getRoleName().equals("CUSTOMER")){
                sendUserInfoForSaveCustomer(CustomerSaveFromUserModel.builder()
                        .authId(user.getAuthId())
                        .userId(user.getId())
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .status(user.getStatus()).build());
            }
        });
    }
    /**
     * Müşteri bilgilerini kaydetmek için gereken bilgileri gönderir.
     *
     * @param customerSaveFromUserModel Müşteri kaydetme bilgilerini içeren model
     */
    private void sendUserInfoForSaveCustomer(CustomerSaveFromUserModel customerSaveFromUserModel){
        rabbitTemplate.convertAndSend("businessDirectExchange","keySaveCustomerFromUser",customerSaveFromUserModel);
    }

    /**
     * Auth ID'ye göre kullanıcının rollerini döner.
     *
     * @param authId Kullanıcının Auth ID'si
     * @return Kullanıcının rollerini içeren model
     */
    @RabbitListener(queues = "queueRolesByAuthId")
    public UserRoleListModel sendAuthRoles(Long authId) { //private kurallarına bak

        return getRolesForSecurity(authId);
    }


    /**
     * Güvenlik amaçlı olarak kullanıcının rollerini döner.
     *
     * @param authId Kullanıcının Auth ID'si
     * @return Kullanıcının rollerini içeren model
     */
    public UserRoleListModel getRolesForSecurity(Long authId){
        List<Role> userRoles = userRepository.getUserRoles(authId);
        List<String> userRolesString = new ArrayList<>();
        userRoles.forEach(role -> {
            userRolesString.add(role.getRoleName());


        });
        return UserRoleListModel.builder().userRoles(userRolesString).build();
    }

    /**
     * Kullanıcı durumunu aktif olarak günceller.
     *
     * @param authId Kullanıcının Auth ID'si
     */
    @Transactional
    public void updateUserStatusToActive(Long authId){
        User user = userRepository.findByAuthId(authId).orElseThrow(() -> new UserException(ErrorType.USER_NOT_FOUND));
        user.setStatus(EStatus.ACTIVE);
        userRepository.save(user);
        List<Long> adminIds = new ArrayList<>();
        adminIds.add(1L);
        rabbitTemplate.convertAndSend("notificationExchange","notificationKey",RabbitMQNotification.builder().title("Kullanıcı Aktifleştirmeleri").authIds(adminIds).message(user.getFirstName()+" isimli "+ user.getId() + " user id'li kullanıcı Hesabını aktive etti").build());
    }
    /**
     * Auth servisinden gelen kullanıcı aktivasyon isteğini dinler.
     *
     * @param authId Kullanıcının Auth ID'si
     */
    @RabbitListener(queues = "queueActivateUserFromAuth")
    public void listenAndActivateUser(Long authId){
        updateUserStatusToActive(authId);
    }

    /**
     * JWT token kullanarak kullanıcının rollerini döner.
     *
     * @param jwtToken JWT token
     * @return Kullanıcı rolleri
     */
    public List<String> getUserRoles(String jwtToken) {
        Long authId = jwtTokenManager.getAuthIdFromToken(jwtToken).orElseThrow(()-> new UserException(ErrorType.INVALID_TOKEN));

        User user = userRepository.findByAuthId(authId).orElseThrow(() -> new UserException(ErrorType.USER_NOT_FOUND));

        return user.getRole().stream().map(Role::getRoleName).toList();
    }
    /**
     * Kullanıcının bilgilerini JWT token ile alır.
     *
     * @param jwtToken JWT token
     * @return Kullanıcı bilgilerini içeren DTO
     */
    public GetUserInformationDTO getUserInformation(String jwtToken) {
        Long authId = jwtTokenManager.getAuthIdFromToken(jwtToken).orElseThrow(()-> new UserException(ErrorType.INVALID_TOKEN));
        User user = userRepository.findByAuthId(authId).orElseThrow(() -> new UserException(ErrorType.USER_NOT_FOUND));

        String usersMail = (String) rabbitTemplate.convertSendAndReceive("businessDirectExchange","keyGetMailByAuthId", user.getAuthId());


        return GetUserInformationDTO.builder().id(user.getId()).authId(user.getAuthId()).firstName(user.getFirstName()).lastName(user.getLastName()).email(usersMail).build();
    }
    /**
     * Abonelikten gelen rol ekleme isteğini dinler ve kullanıcıya rol ekler.
     *
     * @param addRoleFromSubscriptionModel Rol ekleme bilgilerini içeren model
     */
    @RabbitListener(queues = "queueAddRoleFromSubscription")
    public void addRoleFromSubscription(AddRoleFromSubscriptionModel addRoleFromSubscriptionModel) {
        User user = userRepository.findByAuthId(addRoleFromSubscriptionModel.getAuthId()).orElseThrow(() -> new UserException(ErrorType.USER_NOT_FOUND));
        user.setRole(new ArrayList<>()); //Kullanıcının rollerini sıfırlamak için yenmi bir liste tanımlanır.
        user.getRole().add(roleService.findByRoleName("MEMBER")); //Kullanıcıya MEMBER rol tanımlanır.

        // if addRoleFromSubscriptionModel.roles is not empty then add roles
        if(!addRoleFromSubscriptionModel.getRoles().isEmpty()){
            addRoleFromSubscriptionModel.getRoles().forEach(roleName -> {
                Role role = roleService.findByRoleName(roleName);
                user.getRole().add(role);
            });
        }
        // if addRoleFromSubscriptionModel.roles is empty just save it empty
        userRepository.save(user);
    }
    /**
     * Abonelikten gelen rol silme isteğini dinler ve kullanıcının rolünü siler.
     *
     * @param deleteRoleFromSubscriptionModel Rol silme bilgilerini içeren model
     */
    @RabbitListener(queues = "queueDeleteRoleFromSubscription")
    public void deleteRoleFromSubscription(DeleteRoleFromSubscriptionModel deleteRoleFromSubscriptionModel) {
        User user = userRepository.findByAuthId(deleteRoleFromSubscriptionModel.getAuthId()).orElseThrow(() -> new UserException(ErrorType.USER_NOT_FOUND));
        if(deleteRoleFromSubscriptionModel.getRoles().isEmpty()){
            throw new UserException(ErrorType.ROLE_LIST_IS_EMPTY);
        }

        deleteRoleFromSubscriptionModel.getRoles().forEach(roleName -> {
            Role role = roleService.findByRoleName(roleName);
            user.getRole().remove(role);
        });
        userRepository.save(user);

    }

    /**
     * Kullanıcının e-posta adresini değiştirir.
     *
     * @param changeUserEmailRequestDTO E-posta değiştirme isteğini içeren DTO
     * @return E-posta değiştirme işleminin durumu
     */
    @Transactional
    public Boolean changeUserEmail(ChangeUserEmailRequestDTO changeUserEmailRequestDTO) {

        User user = userRepository.findById(changeUserEmailRequestDTO.id()).orElseThrow(() -> new UserException(ErrorType.USER_NOT_FOUND));

        boolean isEmailExist = (boolean) rabbitTemplate.convertSendAndReceive("businessDirectExchange", "keyCheckEmailExists", changeUserEmailRequestDTO.email());

        if(isEmailExist){
            throw new UserException(ErrorType.EMAIL_ALREADY_TAKEN);
        }

        sendUserMailToAuthService(AuthMailUpdateFromUser.builder().authId(user.getAuthId()).email(changeUserEmailRequestDTO.email()).build());


        return true;
    }
    /**
     * Kullanıcının şifresini değiştirir.
     *
     * @param changeUserPassword Şifre değiştirme isteğini içeren DTO
     * @return Şifre değiştirme işleminin durumu
     */
    public Boolean changeUserPassword(ChangeUserPassword changeUserPassword) {
        User user = userRepository.findById(changeUserPassword.userId()).orElseThrow(() -> new UserException(ErrorType.USER_NOT_FOUND));
        String userNewPassword = passwordGenerator();
        rabbitTemplate.convertAndSend("businessDirectExchange","keyChangePasswordFromUser",ChangePasswordFromUserModel.builder().authId(user.getAuthId()).newPassword(userNewPassword).build());
        String usersMail = (String) rabbitTemplate.convertSendAndReceive("businessDirectExchange","keyGetMailByAuthId", user.getAuthId());
        rabbitTemplate.convertAndSend("businessDirectExchange","keySendMailNewPassword",SendMailNewPasswordModel.builder().newPassword(userNewPassword).email(usersMail).build());
        return true;
    }
    /**
     * Rastgele bir şifre oluşturur.
     *
     * @return Oluşturulan şifre
     */
    public String passwordGenerator(){
        String codeSource= UUID.randomUUID().toString();
        String[] splitCodeSource = codeSource.split("-");
        StringBuilder code= new StringBuilder();
        for (String s : splitCodeSource) {
            code.append(s.charAt(0));
        }
        return code.toString();
    }
    /**
     * Kullanıcı durumunu günceller.
     *
     * @param updateUserStatusRequestDTO Kullanıcı durumu güncelleme isteğini içeren DTO
     * @return Durum güncelleme işleminin durumu
     */
    @Transactional
    public Boolean updateUserStatus(UpdateUserStatusRequestDTO updateUserStatusRequestDTO) {
        User user = userRepository.findById(updateUserStatusRequestDTO.userId()).orElseThrow(() -> new UserException(ErrorType.USER_NOT_FOUND));
        user.setStatus(updateUserStatusRequestDTO.status());
        rabbitTemplate.convertAndSend("businessDirectExchange", "keyUpdateStatus",UpdateStatusModel.builder().authId(user.getAuthId()).status(user.getStatus()).build());
        userRepository.save(user);

        return null;
    }
    /**
     * JWT token kullanarak kullanıcı ID'sini döner.
     *
     * @param token JWT token
     * @return Kullanıcı ID'si
     */
    @RabbitListener(queues = "queueGetUserIdByToken")
    public Long getUserIdByToken(String token) {

        //String jwtToken = token.replace("Bearer ", ""); eğer token Normal gelmezse yalın hale getirmek için bunu yorum satırından kaldırın daha sonra jwtToken değişkenini token değişkeni yerine bir alt satırdaki Long authId = jwtTokenManager.getAuthIdFromToken(token).orElseThrow(()->new UserException(ErrorType.INVALID_TOKEN)); metodunda kullanın

        Long authId = jwtTokenManager.getAuthIdFromToken(token).orElseThrow(()->new UserException(ErrorType.INVALID_TOKEN));

        User user = userRepository.findByAuthId(authId).orElseThrow(() -> new UserException(ErrorType.USER_NOT_FOUND));

        return user.getId();
    }

    public GetUserInformationDTO getUserInformationById(Long authId) {
        User user = userRepository.findByAuthId(authId).orElseThrow(() -> new UserException(ErrorType.USER_NOT_FOUND));
        String usersMail = (String) rabbitTemplate.convertSendAndReceive("businessDirectExchange","keyGetMailByAuthId", user.getAuthId());
        return GetUserInformationDTO.builder().id(user.getId()).authId(user.getAuthId()).firstName(user.getFirstName()).lastName(user.getLastName()).email(usersMail).build();
    }

}
