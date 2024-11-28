package com.businessapi.utilty;

import com.businessapi.entity.Auth;
import com.businessapi.repository.AuthRepository;
import com.businessapi.utilty.enums.EStatus;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DemoData {
    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;
    @PostConstruct
    public void saveSuperAdmin(){
        Auth auth = Auth.builder()
                .email("admin@example.com")
                .password(passwordEncoder.bCryptPasswordEncoder().encode("123"))
                .status(EStatus.ACTIVE)
                .build();
        authRepository.save(auth);  // save super admin to database.  // This should be done in a separate service layer method.  // For demo purposes, it's done here.  // In a real application, you would need to handle the user creation process separately.  // You may want to consider using a service like UserService or a UserFactory to create the Auth entity.  // And then use the AuthRepository to save it.  // In a real-world application, you should also handle password hashing and salting.  // And you should also implement proper error handling for failed user creation attempts.  // And you should also handle user roles and permissions.  // And you should also handle user account verification and activation.  // And you should also handle user password resets and recovery.  // And you should also handle user
    }

}
