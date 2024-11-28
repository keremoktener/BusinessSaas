package com.businessapi.dto.requestDTOs;

import jakarta.validation.constraints.NotNull;

public record ChangeUserPassword (
        @NotNull Long userId
) {
}
