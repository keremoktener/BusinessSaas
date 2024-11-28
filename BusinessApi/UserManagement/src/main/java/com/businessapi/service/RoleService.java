package com.businessapi.service;

import com.businessapi.dto.requestDTOs.PageRequestDTO;
import com.businessapi.dto.requestDTOs.RoleCreateDTO;
import com.businessapi.dto.requestDTOs.RoleUpdateRequestDTO;
import com.businessapi.dto.requestDTOs.UpdateUserRoleStatusDTO;
import com.businessapi.dto.responseDTOs.PageableRoleListResponseDTO;
import com.businessapi.dto.responseDTOs.RoleResponseDTO;
import com.businessapi.entity.Role;
import com.businessapi.entity.User;
import com.businessapi.entity.enums.EStatus;
import com.businessapi.exception.ErrorType;
import com.businessapi.exception.UserException;
import com.businessapi.mapper.RoleMapper;
import com.businessapi.repository.RoleRepository;
import com.businessapi.views.GetAllRoleView;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class RoleService {
    private final RoleRepository roleRepository;


    /**
     * Verilen RoleCreateDTO bilgilerine göre yeni bir kullanıcı rolü oluşturur.
     *
     * @param roleCreateDTO Rol oluşturma detaylarını içeren DTO.
     */
    public void createUserRole(RoleCreateDTO roleCreateDTO) {
        Role role = RoleMapper.INSTANCE.roleCreateDTOToRole(roleCreateDTO);
        role.setRoleName(role.getRoleName().toUpperCase());
        roleRepository.save(role);
    }


    /**
     * Verilen rol ID'lerine göre rol listesini getirir.
     *
     * @param roleIds Getirilecek rol ID'lerinin listesi.
     * @return Role nesnelerinin listesi.
     * @throws UserException Eğer verilen ID'lerle eşleşen roller bulunamazsa.
     */
    public List<Role> getRolesByRoleId(List<Long> roleIds) {
        List<Role> findedRoles = roleRepository.findAllById(roleIds);
        if (findedRoles.isEmpty()) {
            throw new UserException(ErrorType.ROLE_DATA_IS_EMPTY);
        }
        return findedRoles;
    }


    /**
     * Verilen RoleUpdateRequestDTO bilgilerine göre mevcut bir kullanıcı rolünü günceller.
     *
     * @param roleUpdateRequestDTO Rol güncelleme detaylarını içeren DTO.
     * @throws UserException Eğer rol bulunamazsa.
     */
    public void updateUserRole(RoleUpdateRequestDTO roleUpdateRequestDTO) {
        Role role = roleRepository.findById(roleUpdateRequestDTO.roleId()).orElseThrow(() -> new UserException(ErrorType.ROLE_NOT_FOUND));
        role.setRoleName(roleUpdateRequestDTO.roleName());
        role.setRoleDescription(roleUpdateRequestDTO.roleDescription());
        roleRepository.save(role);
    }


    /**
     * Verilen roleId'ye sahip kullanıcı rolünü silinmiş olarak işaretler (durumunu DELETED olarak ayarlar).
     *
     * @param roleId Silinecek rolün ID'si.
     * @throws UserException Eğer rol bulunamazsa.
     */
    public void deleteUserRole(Long roleId) {
        Role role = roleRepository.findById(roleId).orElseThrow(() -> new UserException(ErrorType.ROLE_NOT_FOUND));
        role.setStatus(EStatus.DELETED);
        roleRepository.save(role);
    }



    /**
     * Sayfalama ve arama kriterlerine göre tüm kullanıcı rollerini getirir.
     *
     * @param pageRequestDTO Sayfalama ve arama metni içeren DTO.
     * @return Sayfalama bilgilerini ve rollerin listesini içeren PageableRoleListResponseDTO.
     */
    public PageableRoleListResponseDTO getAllUserRoles(PageRequestDTO pageRequestDTO) {
        Pageable pageable = PageRequest.of(pageRequestDTO.page(), pageRequestDTO.size());
        Page<GetAllRoleView> allRoles = roleRepository.getAllRolesWithSearch(pageRequestDTO.searchText(), pageable);

        List<RoleResponseDTO> roleResponseDTOs = new ArrayList<>();
        allRoles.getContent().forEach(role -> {
            roleResponseDTOs.add(RoleMapper.INSTANCE.getAllRoleViewToRoleResponseDTO(role));
        });
        return PageableRoleListResponseDTO.builder().roleList(roleResponseDTOs).currentPage(allRoles.getNumber()).totalPages(allRoles.getTotalPages()).totalElements(allRoles.getTotalElements()).build();

    }


    /**
     * Verilen roleId'ye göre rol detaylarını getirir.
     *
     * @param roleId Getirilecek rolün ID'si.
     * @return Rol nesnesi.
     * @throws UserException Eğer rol bulunamazsa.
     */
    public Role getRoleById(Long roleId) {
        return roleRepository.findById(roleId).orElseThrow(() -> new UserException(ErrorType.ROLE_NOT_FOUND));
    }



    /**
     * Verilen kullanıcı için atanabilir tüm rollerin listesini getirir.
     *
     * @param user Roller için kullanıcının bilgileri.
     * @return Atanabilir rollerin listesini içeren RoleResponseDTO nesneleri.
     */
    public List<RoleResponseDTO> getAllAssignableRoles(User user) {
        List<Role> allRoles = roleRepository.findAll();
        allRoles.removeIf(role -> role.getRoleName().equals("SUPER_ADMIN")|| !role.getStatus().equals(EStatus.ACTIVE));
        allRoles.removeAll(user.getRole());
        List<RoleResponseDTO> roleResponseDTOs = new ArrayList<>();
        allRoles.forEach(role -> {
            roleResponseDTOs.add(RoleMapper.INSTANCE.roleToRoleResponseDTO(role));
        });

        return roleResponseDTOs;
    }



    /**
     * Belirtilen rol adının var olup olmadığını kontrol eder.
     *
     * @param roleName Kontrol edilecek rol adı.
     * @return Rol mevcutsa true, değilse false.
     */
    public Boolean checkIfRoleExistsByRoleName(String roleName) {
        return roleRepository.existsByRoleNameIgnoreCase(roleName);
    }



    /**
     * Verilen rol nesnesini veritabanına kaydeder.
     *
     * @param role Kaydedilecek rol nesnesi.
     * @return Kaydedilen Role nesnesi.
     */
    public Role saveRole(Role role) {
        return roleRepository.save(role);
    }

    /**
     * Belirtilen rol adına göre rolü bulur.
     *
     * @param roleName Bulunacak rolün adı.
     * @return Bulunan Role nesnesi.
     * @throws UserException Eğer rol bulunamazsa.
     */
    public Role findByRoleName(String roleName) {
        return roleRepository.findByRoleNameIgnoreCase(roleName).orElseThrow(()-> new UserException(ErrorType.ROLE_NOT_FOUND));
    }


    /**
     * Belirtilen role ID'sine göre rolün durumunu günceller.
     *
     * @param updateUserRoleStatusDTO Rol durumunu güncelleme bilgilerini içeren DTO.
     * @return İşlem başarılıysa true, başarısızsa false.
     * @throws UserException Eğer rol bulunamazsa.
     */
    public Boolean updateUserRoleStatus(UpdateUserRoleStatusDTO updateUserRoleStatusDTO) {
        Role role = roleRepository.findById(updateUserRoleStatusDTO.roleId()).orElseThrow(() -> new UserException(ErrorType.ROLE_NOT_FOUND));
        role.setStatus(updateUserRoleStatusDTO.status());
        roleRepository.save(role);

        return null;
    }
}
