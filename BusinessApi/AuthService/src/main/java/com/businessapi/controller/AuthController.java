package com.businessapi.controller;

import static com.businessapi.constants.EndPoints.*;

import com.businessapi.dto.request.*;
import com.businessapi.dto.response.ResponseDTO;
import com.businessapi.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(AUTH)
@RequiredArgsConstructor
@CrossOrigin(origins = "*", methods = {RequestMethod.POST, RequestMethod.GET, RequestMethod.PUT,RequestMethod.DELETE})
public class AuthController {
    private final AuthService authService;

    @PostMapping(REGISTER)
    @Operation( summary = "Register a new auth",
            description = "Registers a new auth in the system. The user details must be provided in the request body.")
   public ResponseEntity<ResponseDTO<Boolean>> register(@RequestBody RegisterRequestDTO dto){
        return ResponseEntity.ok(ResponseDTO.<Boolean>builder()
               .data(authService.register(dto))
               .code(200)
               .message("Succesfully registered")
               .build());

   }

   @GetMapping(VERIFYACCOUNT)
   @Operation(
           summary = "Verify  account",
           description = " Verifies an account with the provided token. The token must be provided in the query parameter.\" "
   )
   public ResponseEntity<ResponseDTO<Boolean>> verifyAccount(@RequestParam String token) {
       return ResponseEntity.ok(ResponseDTO.<Boolean>builder()
               .data(authService.verifyAccount(token))
               .code(200)
               .message("Succesfully verified")
               .build());
   }


   @PostMapping(LOGIN)
   @Operation(
           summary = "Login a user",
           description = "Logs in a user with the provided credentials. The credentials must be provided in the request body."
   )
   public ResponseEntity<ResponseDTO<String>> login(@RequestBody LoginRequestDTO dto){

       return ResponseEntity.ok(ResponseDTO.<String>builder()
               .code(200)
               .message("Succesfully logged in")
               .data(authService.login(dto))
               .build());
   }

    @DeleteMapping(DELETE)
    @Operation(
           summary = "Delete an auth",
           description = "Delete an auth from the system. The auth ID must be passed as a query parameter.")
    public ResponseEntity<ResponseDTO<Boolean>> deleteAuth(@RequestParam Long authId) {
        return ResponseEntity.ok(ResponseDTO.<Boolean>builder()
                .data(authService.deleteAuth(authId))
                .code(200)
                .message("Succesfully deleted")
                .build());
    }

@PostMapping(FORGETPASSWORD)
    @Operation(
           summary = "Forget password",
           description = "Forgets the password of a user with the provided email. The email must be provided in the request body.")
    public ResponseEntity<ResponseDTO<Boolean>> forgetPassword(@RequestParam String email) {
        return ResponseEntity.ok(ResponseDTO.<Boolean>builder()
               .data(authService.forgetPassword(email))
               .code(200)
               .message("Password reset link sent")
               .build());
    }

    @PostMapping (RESETPASSWORD)
    @Operation(
           summary = "Reset password",
           description = "Resets the password of a user with the provided email and reset token. The email and reset token must be provided in the request body.")
    public ResponseEntity<ResponseDTO<Boolean>> resetPassword(@RequestBody ResetPasswordRequestDTO dto){
        return ResponseEntity.ok(ResponseDTO.<Boolean>builder()
               .data(authService.resetPassword(dto)).code(200).message("Password reset successfully").build());
    }


    @PostMapping("/login-profile-management")
    public ResponseEntity<ResponseDTO<Boolean>> loginProfileManagement(@RequestBody LoginProfileManagementDTO dto, @RequestHeader("Authorization") String token){
        return ResponseEntity.ok(ResponseDTO.<Boolean>builder().code(200).data(authService.loginProfileManagement(dto,token)).message("Login Profile Management Approved").build());
    }

    @PutMapping("/change-my-password")
    public ResponseEntity<ResponseDTO<Boolean>> changeMyPassword(@RequestBody ChangeMyPasswordRequestDTO dto, @RequestHeader("Authorization") String token){
        return ResponseEntity.ok(ResponseDTO.<Boolean>builder().code(200).message("Password changed").data(authService.changeMyPassword(dto,token)).build());
    }



}
