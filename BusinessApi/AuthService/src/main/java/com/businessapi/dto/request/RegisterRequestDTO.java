package com.businessapi.dto.request;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public record RegisterRequestDTO(
        @NotNull String firstName,
        @NotNull String lastName,

        @Email
        @NotNull String email,

        @NotNull String password,
        @NotNull String rePassword
) {}
