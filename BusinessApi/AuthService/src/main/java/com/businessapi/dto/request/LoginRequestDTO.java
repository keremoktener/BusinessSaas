package com.businessapi.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public record LoginRequestDTO(
        @Email(message = "Email must be a valid email address.")
        @NotNull String email,

        @NotNull String password
) {}
