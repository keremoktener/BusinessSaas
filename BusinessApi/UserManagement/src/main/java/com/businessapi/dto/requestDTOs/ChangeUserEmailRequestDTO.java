package com.businessapi.dto.requestDTOs;

import jakarta.validation.constraints.NotNull;

public record ChangeUserEmailRequestDTO (
        @NotNull Long id,
        @NotNull String email
) {
}
