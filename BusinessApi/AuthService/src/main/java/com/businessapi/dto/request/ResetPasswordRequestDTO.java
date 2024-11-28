package com.businessapi.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


public record ResetPasswordRequestDTO(
        String token,
        String newPassword,
        String rePassword)
{
}
