package com.businessapi.dto.request;

import jakarta.validation.constraints.NotNull;

public record ChangeMyPasswordRequestDTO(
        @NotNull Long authId,
        @NotNull String newPassword,
        @NotNull String newConfirmPassword
) {
}
