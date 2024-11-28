package com.businessapi.util;

import com.businessapi.dto.requestDTOs.UserSaveRequestDTO;
import com.businessapi.entity.Role;
import com.businessapi.entity.User;
import com.businessapi.entity.enums.EStatus;
import com.businessapi.repository.RoleRepository;
import com.businessapi.repository.UserRepository;

import com.businessapi.service.UserService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
public class DemoData  implements ApplicationRunner {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserService userService;
    private final Random random = new Random();

    @Override
    public void run(ApplicationArguments args) throws Exception {
        saveBaseRoles();
        saveSuperAdmin();
        saveUsers();
    }


    private void saveSuperAdmin(){
        List<Role> roles = new ArrayList<>();
        roles.add(roleRepository.findById(1L).get());
        roles.add(roleRepository.findById(2L).get());
        User superAdmin = User.builder()
                .role(roles)
                .authId(1L)
                .firstName("Super")
                .lastName("Admin")
                .status(EStatus.ACTIVE)
                .build();
        userRepository.save(superAdmin);
    }

    private void saveBaseRoles(){
        Role superAdminRole = Role.builder()
                .roleName("SUPER_ADMIN")
                .roleDescription("God of The App")
                .build();
        Role member = Role.builder().roleName("MEMBER").build();

        Role adminRole = Role.builder()
                .roleName("ADMIN")
                .roleDescription("VP")
                .build();

        Role pmm = Role.builder().roleName("PMM").roleDescription("Proje Yönetimi Modülü Satın Alan Kullanıcı").build();
        Role crmm = Role.builder().roleName("CRMM").roleDescription("CRM Modülü Satın Alan Kullanıcı").build();
        Role imm = Role.builder().roleName("IMM").roleDescription("Envanter Yönetimi Modülü Satın Alan Kullanıcı").build();
        Role hrmm = Role.builder().roleName("HRMM").roleDescription("İK Yönetimi Modülü Satın Alan Kullanıcı").build();
        Role fam = Role.builder().roleName("FAM").roleDescription("Finans ve Muhasebe Modülü Satın Alan Kullanıcı").build();
        Role oam = Role.builder().roleName("OAM").roleDescription("Analiz Modülü Satın Alan Kullanıcı").build();


        Role supporter = Role.builder().roleName("SUPPORTER").roleDescription("Uygulamamızı satın alan kullanıcılara destek verecek kişilerin rolü").build();


        roleRepository.save(superAdminRole); //1
        roleRepository.save(adminRole); //2
        roleRepository.save(member);    //3
        roleRepository.save(pmm);   //4
        roleRepository.save(crmm);   //5
        roleRepository.save(imm);   //6
        roleRepository.save(hrmm);  //7
        roleRepository.save(fam);   //8
        roleRepository.save(oam);   //9
        roleRepository.save(supporter);//10
    }


    private void saveUsers(){
        List<Long> roles = new ArrayList<>(List.of(3L, 4L, 5L, 6L, 7L, 8L, 9L));
        UserSaveRequestDTO user = new UserSaveRequestDTO("Super Member","USER","member@example.com","123",roles);
        userService.saveUser(user);

        List<Long> roles2 = new ArrayList<>(List.of(3L));
        UserSaveRequestDTO user2 = new UserSaveRequestDTO("Lower Member","USER","member2@example.com","123",roles2);
        userService.saveUser(user2);

        List<Long> roles3 = new ArrayList<>(List.of(4L,10L));
        UserSaveRequestDTO user3 = new UserSaveRequestDTO("supporter Member","USER","supporter@example.com","123",roles3);
        userService.saveUser(user3);



        List<String> firstNames = Arrays.asList("Ahmet", "Ayşe", "Mehmet", "Fatma", "Ali", "Zeynep", "Mustafa", "Elif", "Burak", "Cem");
        List<String> lastNames = Arrays.asList("Yılmaz", "Kaya", "Demir", "Çelik", "Şahin", "Aydın", "Koç", "Eren", "Çetin", "Öztürk");

        /*for (int i = 0; i < 50; i++) {

            String firstName = firstNames.get(random.nextInt(firstNames.size()));
            String lastName = lastNames.get(random.nextInt(lastNames.size()));


            String email = firstName.toLowerCase() + "." + lastName.toLowerCase() + i + "@example.com";


            UserSaveRequestDTO user4 = new UserSaveRequestDTO(firstName, lastName, email, "123", roles2);
            userService.saveUser(user4);
        }*/



    }


}
