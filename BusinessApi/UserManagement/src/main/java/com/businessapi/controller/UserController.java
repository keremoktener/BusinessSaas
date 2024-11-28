package com.businessapi.controller;

import com.businessapi.constants.EndPoints;
import com.businessapi.constants.messages.SuccesMessages;
import com.businessapi.dto.requestDTOs.*;
import com.businessapi.dto.responseDTOs.GetAllUsersResponseDTO;
import com.businessapi.dto.responseDTOs.GetUserInformationDTO;
import com.businessapi.dto.responseDTOs.PageableUserListResponseDTO;
import com.businessapi.dto.responseDTOs.ResponseDTO;
import com.businessapi.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RequiredArgsConstructor
@RestController
@RequestMapping(EndPoints.USER)
public class UserController {
    private final UserService userService;



    @PostMapping(EndPoints.SAVE)
    @PreAuthorize("hasAnyAuthority('SUPER_ADMIN','ADMIN')")
    @Operation(summary = "Admin tarafından kullanıcı oluşturma",security = @SecurityRequirement(name = "bearerUser"))
    public ResponseEntity<ResponseDTO<Boolean>> saveUser(@RequestBody @Valid UserSaveRequestDTO userSaveRequestDTO){
        userService.saveUser(userSaveRequestDTO);
        return ResponseEntity.ok(ResponseDTO.<Boolean>builder().code(200).message(SuccesMessages.USER_SAVED).build());
    }



    @PutMapping(EndPoints.UPDATE)
    @PreAuthorize("hasAnyAuthority('SUPER_ADMIN','ADMIN','MEMBER')")
    @Operation(summary = "AuthId'si verilen kullanıcıların bilgilerinin güncellenmesi",security = @SecurityRequirement(name = "bearerUser"))
    public ResponseEntity<ResponseDTO<Boolean>> updateUser(@RequestBody @Valid UserUpdateRequestDTO userUpdateRequestDTO){
        userService.updateUser(userUpdateRequestDTO);
        return ResponseEntity.ok(ResponseDTO.<Boolean>builder().code(200).message("success").build());
    }


    @PutMapping(EndPoints.DELETE)
    @PreAuthorize("hasAnyAuthority('SUPER_ADMIN','ADMIN')")
    @Operation(summary = "AuthId'si verilen kullanıcının soft delete'i",security = @SecurityRequirement(name = "bearerUser"))
    public ResponseEntity<ResponseDTO<Boolean>> deleteUser(@RequestBody UserDeleteRequestDTO userDeleteRequestDTO){
        userService.deleteUser(userDeleteRequestDTO);
        return ResponseEntity.ok(ResponseDTO.<Boolean>builder().code(200).message(SuccesMessages.USER_DELETED).build());
    }

    @PreAuthorize("hasAnyAuthority('SUPER_ADMIN','ADMIN')")
    @GetMapping("/get-all-users")
    @Operation(summary = "Tüm kuullanıcıları getirir, adminin rol atamasi için ilk yöntem",security = @SecurityRequirement(name = "bearerUser"))
    public ResponseEntity<ResponseDTO<List<GetAllUsersResponseDTO>>> getAllUsers(){
        return ResponseEntity.ok(ResponseDTO.<List<GetAllUsersResponseDTO>>builder().code(200).data(userService.getAllUser()).message("All users sent").build());
    }


    @PutMapping("/add-role-to-user")
    @PreAuthorize("hasAnyAuthority('SUPER_ADMIN','ADMIN')")
    @Operation(summary = "Admin tarafından tüm rollerin görüntülenmesi için gerekli istek",security = @SecurityRequirement(name = "bearerUser"))
    public ResponseEntity<ResponseDTO<Boolean>> addRoleToUser(@RequestBody  AddRoleToUserRequestDTO addRoleToUserRequestDTO){
        userService.addRoleToUser(addRoleToUserRequestDTO);
        return ResponseEntity.ok(ResponseDTO.<Boolean>builder().code(200).message("Role added to user").build());
    }

    @Operation(security = @SecurityRequirement(name = "bearerUser"))
    @GetMapping("/get-user-roles")
    public ResponseEntity<ResponseDTO<List<String>>> getAllUsersRoles(@RequestHeader("Authorization") String token){
        String jwtToken = token.replace("Bearer ", "");
        return ResponseEntity.ok(ResponseDTO.<List<String>>builder().code(200).message("User roles sent").data(userService.getUserRoles(jwtToken)).build());
    }

    @Operation(security = @SecurityRequirement(name = "bearerUser"))
    @PreAuthorize("hasAnyAuthority('SUPER_ADMIN','ADMIN','MEMBER')")
    @GetMapping("/get-users-profile-information")
    public ResponseEntity<ResponseDTO<GetUserInformationDTO>> getUserProfileInformation(@RequestHeader("Authorization") String token){
        String jwtToken = token.replace("Bearer ", "");
        return ResponseEntity.ok(ResponseDTO.<GetUserInformationDTO>builder().code(200).message("User profile information sent").data(userService.getUserInformation(jwtToken)).build());
    }


    @PutMapping("/change-user-email")
    @PreAuthorize("hasAnyAuthority('SUPER_ADMIN','ADMIN')")
    public ResponseEntity<ResponseDTO<Boolean>> changeUserEmail(@RequestBody ChangeUserEmailRequestDTO changeUserEmailRequestDTO){
        return ResponseEntity.ok(ResponseDTO.<Boolean>builder().code(200).data(userService.changeUserEmail(changeUserEmailRequestDTO)).message("success").build());
    }

    @PutMapping("/change-user-password")
    @PreAuthorize("hasAnyAuthority('SUPER_ADMIN','ADMIN')")
    public ResponseEntity<ResponseDTO<Boolean>> changeUserPassword(@RequestBody ChangeUserPassword changeUserPassword){
        return ResponseEntity.ok(ResponseDTO.<Boolean>builder().code(200).data(userService.changeUserPassword(changeUserPassword)).message("A new password has been sent to the user's e-mail address.").build());
    }

    @PutMapping("/update-user-status")
    @PreAuthorize("hasAnyAuthority('SUPER_ADMIN','ADMIN')")
    public ResponseEntity<ResponseDTO<Boolean>> updateUserStatus(@RequestBody UpdateUserStatusRequestDTO updateUserStatusRequestDTO){
        return ResponseEntity.ok(ResponseDTO.<Boolean>builder().code(200).message("User status updated").data(userService.updateUserStatus(updateUserStatusRequestDTO)).build());
    }

    @PostMapping("/get-users-with-page")
    @PreAuthorize("hasAnyAuthority('SUPER_ADMIN','ADMIN','MEMBER')")
    @Operation(security = @SecurityRequirement(name = "bearerUser"))
    public ResponseEntity<ResponseDTO<PageableUserListResponseDTO>> getUsersPagable(@RequestBody PageRequestDTO pageRequestDTO){
        return ResponseEntity.ok(ResponseDTO.<PageableUserListResponseDTO>builder().code(200).message("Sended").data(userService.pageableGettAll(pageRequestDTO)).build());
    }
    @Operation(security = @SecurityRequirement(name = "bearerUser"))
    @PreAuthorize("hasAnyAuthority('SUPER_ADMIN','ADMIN','SUPPORTER')")
    @PostMapping("/get-users-profile-information-by-id")
    public ResponseEntity<ResponseDTO<GetUserInformationDTO>> getUserProfileInformationById(@RequestParam Long authId){
        return ResponseEntity.ok(ResponseDTO.<GetUserInformationDTO>builder().code(200).message("User profile information sent").data(userService.getUserInformationById(authId)).build());
    }

}
