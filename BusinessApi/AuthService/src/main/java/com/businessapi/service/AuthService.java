package com.businessapi.service;



import com.businessapi.RabbitMQ.Model.*;
import com.businessapi.dto.request.*;
import com.businessapi.entity.Auth;


import com.businessapi.utilty.enums.EStatus;
import com.businessapi.exception.AuthServiceException;
import static com.businessapi.exception.ErrorType.*;
import com.businessapi.repository.AuthRepository;
import com.businessapi.utilty.JwtTokenManager;
import com.businessapi.utilty.PasswordEncoder;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthRepository authRepository;
    private final JwtTokenManager jwtTokenManager;
    private final PasswordEncoder passwordEncoder;
    private final RabbitTemplate rabbitTemplate;


    @Transactional
    public Boolean register(RegisterRequestDTO dto) {
        // TODO: Implement register logic here
        // Check if email already exists
        // Encrypt password
        // Save user to database
        // Return true if registration is successful, false otherwise
        checkEmailExist(dto.email());
        checkPasswordMatch(dto.password(), dto.rePassword());
        String encodedPassword = passwordEncoder.bCryptPasswordEncoder().encode(dto.password());

        Auth auth = Auth.builder()
                .email(dto.email())
                .password(encodedPassword)
                .build();
        authRepository.save(auth);
        rabbitTemplate.convertAndSend("businessDirectExchange","keySaveUserFromAuth", UserSaveFromAuthModel.builder()
                .authId(auth.getId()).firstName(dto.firstName()).lastName(dto.lastName()).build());

        rabbitTemplate.convertAndSend("businessDirectExchange","keySendVerificationEmail", EmailVerificationModel.builder()
                .email(dto.email()).firstName(dto.firstName()).lastName(dto.lastName()).authId(auth.getId()).build());
        return true;




    }



    @RabbitListener(queues = "queueEmailAndPasswordFromAuth")
    public EmailAndPasswordModel emailAndPasswordFromAuth(Long authId) {
        Auth auth = authRepository.findById(authId).orElseThrow();
        return EmailAndPasswordModel.builder()
                .email(auth.getEmail())
                .encryptedPassword(auth.getPassword())
                .build();


    }

    /**
     * Email must be unique
     * @param email
     */
    private void checkEmailExist(String email) {
        if (authRepository.existsByEmail(email)) {
            throw new AuthServiceException(EMAIL_ALREADY_TAKEN);
        }
    }

    private void checkPasswordMatch(String password, String rePassword) {
        if (!password.equals(rePassword)) {
            throw new AuthServiceException(PASSWORD_MISMATCH);
        }
    }


    public String login(LoginRequestDTO dto) {
        // TODO: Implement login logic here
        // Find user by email
        // Check if user exists
        // Create JWT token
        // Return token if login is successful, throw exception otherwise

        Auth auth = authRepository.findOptionalByEmail(dto.email())
                .orElseThrow(() -> new AuthServiceException(EMAIL_OR_PASSWORD_WRONG));

        if (!auth.getStatus().equals(EStatus.ACTIVE))  {

            throw new AuthServiceException(USER_IS_NOT_ACTIVE);


        }

        if (!passwordEncoder.bCryptPasswordEncoder().matches(dto.password(), auth.getPassword())) {
            throw new AuthServiceException(EMAIL_OR_PASSWORD_WRONG);
        }


        String token = jwtTokenManager.createToken(auth.getId()).orElseThrow(() -> new AuthServiceException(TOKEN_CREATION_FAILED));
        return token;

    }



    /**
     Verifies a user's account by updating the status to ACTIVE.
     * If the user is not found or the account is already active, an exception is thrown.
     *
     * @return Returns true if the account verification is successful.
     * @throws AuthServiceException if the user is not found or the account is already active.
     */
    public Boolean verifyAccount(String token) {


        Long authId = jwtTokenManager.getIdFromToken(token).orElseThrow(() -> new AuthServiceException(INVALID_TOKEN));
        Auth auth = authRepository.findById(authId).orElseThrow(() -> new AuthServiceException(USER_NOT_FOUND));

        if (auth.getStatus().equals(EStatus.ACTIVE)) {

            throw new AuthServiceException(USER_IS_ACTIVE);
        }
        auth.setStatus(EStatus.ACTIVE);
        authRepository.save(auth);
        rabbitTemplate.convertAndSend("businessDirectExchange","keyActivateUserFromAuth", authId);
        return true;
    }

    public Auth findById(Long authId) {
        // TODO: Implement finding user by id logic here
        // Find user by id
        // Return user if found, throw exception otherwise

        Optional<Auth> optionalAuth = authRepository.findById(authId);

        if (optionalAuth.isEmpty()) {
            throw new AuthServiceException(USER_NOT_FOUND);
        }

        return optionalAuth.get();
    }

    /**
     * Deletes (soft delete) an authentication entity by setting its status to DELETED.
     * If the user is not found or already deleted, an exception is thrown.
     *
     * @param authId The ID of the authentication entity to be deleted.
     * @return Returns true if the deletion (status update) is successful.
     * @throws AuthServiceException if the user is not found or already deleted.

     */
    @RabbitListener(queues = "queueDeleteAuth")
    public Boolean deleteAuth(Long authId) {

        Auth auth = authRepository.findById(authId).orElseThrow(() -> new AuthServiceException(USER_NOT_FOUND));
        if (auth.getStatus().equals(EStatus.DELETED)) {
            throw new AuthServiceException(USER_ALREADY_DELETED);
        }
        auth.setStatus(EStatus.DELETED);
        authRepository.save(auth);
        return true;

    }


    /**
     * Listens to the email update messages from the RabbitMQ queue and performs the email update operation.
     *
     * @param authId The ID of the authentication record to update.
     * @param email The new email address to set.
     * @throws AuthServiceException If the user is not found or the new email is already taken.
     */

  @RabbitListener(queues = "queueAuthMailUpdateFromUser")
   public void updateEmail(AuthMailUpdateFromUser authMailUpdateFromUser) {
     Auth auth = authRepository.findById(authMailUpdateFromUser.getAuthId())
               .orElseThrow(() -> new AuthServiceException(USER_NOT_FOUND));
     if(!authMailUpdateFromUser.getEmail().equals(auth.getEmail())) {
         if (authRepository.existsByEmail(authMailUpdateFromUser.getEmail())) {
             throw new AuthServiceException(EMAIL_ALREADY_TAKEN);
         }
         auth.setEmail(authMailUpdateFromUser.getEmail());
         authRepository.save(auth);
     }


  }

    /**
     * Listener method that listens to email update messages from the RabbitMQ queue.
     * Retrieves the email address associated with the provided authentication ID (authId).
     *
     * @param authId The ID of the authentication record whose email is to be retrieved.
     * @return EmailResponseModel A model containing the email address for the corresponding authentication record.
     * @throws AuthServiceException If the user is not found or any other error occurs.
     */

    @RabbitListener(queues ="queueEmailFromCustomer" )
    public EmailResponseModel getEmailByAuthId(Long authId) {

        Auth auth = authRepository.findById(authId)
                .orElseThrow(() -> new AuthServiceException(USER_NOT_FOUND));
       String email = auth.getEmail();

      return  EmailResponseModel.builder()
               .email(email)
               .build();


    }

    public Boolean forgetPassword(String email) {
        Auth auth = authRepository.findOptionalByEmail(email)
                .orElseThrow(() -> new AuthServiceException(USER_NOT_FOUND));

        if (auth.getStatus() == EStatus.ACTIVE) {
            rabbitTemplate.convertAndSend("businessDirectExchange", "keyForgetPassword", email);
            return true;
        } else {
            throw new AuthServiceException(USER_IS_NOT_ACTIVE);
        }
    }

    public Boolean resetPassword(ResetPasswordRequestDTO dto) {
        String email = jwtTokenManager.getEmailFromToken(dto.token()).orElseThrow(() -> new AuthServiceException(INVALID_TOKEN));
        Auth auth = authRepository.findOptionalByEmail(email)
                .orElseThrow(() -> new AuthServiceException(USER_NOT_FOUND));
        if (!dto.newPassword().equals(dto.rePassword())) {
            throw new AuthServiceException(PASSWORD_MISMATCH);
        }

        String encodedPassword = passwordEncoder.bCryptPasswordEncoder().encode(dto.newPassword());
        auth.setPassword(encodedPassword);
        authRepository.save(auth);
        return true;
    }

    @RabbitListener(queues = "queueSaveAuthFromUser")
    public Long saveAuthFromUser(SaveAuthFromUserModel model){
        checkEmailExist(model.getEmail());
        Auth auth = Auth.builder()
                .email(model.getEmail())
                .password(passwordEncoder.bCryptPasswordEncoder().encode(model.getPassword()))
                .status(EStatus.ACTIVE)
                .build();
        authRepository.save(auth);
        return auth.getId();
    }

    @RabbitListener(queues = "queueGetMailByAuthId")
    public String getMailAdressByAuthId(Long authId) {
        authRepository.findById(authId).orElseThrow(() -> new AuthServiceException(USER_NOT_FOUND));
        return authRepository.findEmailById(authId);
    }


    public Boolean loginProfileManagement(LoginProfileManagementDTO dto,String token) {
        String jwtToken = token.replace("Bearer ", "");
        Long authId = jwtTokenManager.getIdFromToken(jwtToken).orElseThrow(() -> new AuthServiceException(INVALID_TOKEN));
        Auth auth = authRepository.findById(authId).orElseThrow(() -> new AuthServiceException(USER_NOT_FOUND));

        if (!passwordEncoder.bCryptPasswordEncoder().matches(dto.password(), auth.getPassword())) {
            throw new AuthServiceException(PASSWORD_WRONG);
        }

        return true;
    }

    public Boolean changeMyPassword(ChangeMyPasswordRequestDTO dto, String token) {
        String jwtToken = token.replace("Bearer ", "");
        Long authId = jwtTokenManager.getIdFromToken(jwtToken).orElseThrow(() -> new AuthServiceException(INVALID_TOKEN));
        if(!authId.equals(dto.authId())){
            throw new AuthServiceException(INVALID_TOKEN);
        }
        Auth auth = authRepository.findById(authId).orElseThrow(() -> new AuthServiceException(USER_NOT_FOUND));
        if(!dto.newPassword().equals(dto.newConfirmPassword())){
            throw new AuthServiceException(PASSWORD_MISMATCH);
        }

        auth.setPassword(passwordEncoder.bCryptPasswordEncoder().encode(dto.newPassword()));
        authRepository.save(auth);

        return true;
    }

    @RabbitListener(queues = "queueChangePasswordFromUser")
    public void changePasswordByAdmin(ChangePasswordFromUserModel changePasswordFromUserModel){
        Auth auth = authRepository.findById(changePasswordFromUserModel.getAuthId()).orElseThrow(() -> new AuthServiceException(USER_NOT_FOUND));
        auth.setPassword(passwordEncoder.bCryptPasswordEncoder().encode(changePasswordFromUserModel.getNewPassword()));
        authRepository.save(auth);
    }

    @RabbitListener(queues = "queueUpdateStatus")
    public void updateAuthStatus(UpdateStatusModel updateStatusModel){
        Auth auth = authRepository.findById(updateStatusModel.getAuthId()).orElseThrow(() -> new AuthServiceException(USER_NOT_FOUND));
        auth.setStatus(updateStatusModel.getStatus());
        authRepository.save(auth);
    }

    @RabbitListener(queues = "queueExistByEmail")
    public Boolean existByEmail(ExistByEmailModel dto){
        return authRepository.existsByEmailIgnoreCase(dto.getEmail());
    }

    @RabbitListener(queues = "queueActiveOrDeactivateAuthOfEmployee")
    public void activateOrDeactivateAuthOfEmployee(Long authId){
        Optional<Auth> auth = authRepository.findById(authId);
        if (auth.isPresent()) {
            if (auth.get().getStatus().equals(EStatus.ACTIVE)) {
                auth.get().setStatus(EStatus.INACTIVE);
                authRepository.save(auth.get());
            } else if (auth.get().getStatus().equals(EStatus.INACTIVE))
            {
                auth.get().setStatus(EStatus.ACTIVE);
                authRepository.save(auth.get());
            }
        }
    }

    @RabbitListener(queues = "queueUpdateEmailOfAuth")
    public void updateEmailOfAuth(UpdateEmailOfAuth dto){
        Optional<Auth> auth = authRepository.findById(dto.getAuthId());
        if (auth.isPresent()) {
            auth.get().setEmail(dto.getEmail());
            authRepository.save(auth.get());
        }
    }

    @RabbitListener(queues = "queueFindMailOfAuth")
    public String findEmailByAuthId(Long authId){
        Optional<Auth> auth = authRepository.findById(authId);
        return auth.map(Auth::getEmail).orElse(null);
    }
    @RabbitListener(queues = "queueCheckEmailExists")
    public boolean checkEmailExists(String email){
        return authRepository.existsByEmailIgnoreCase(email);
    }


}
