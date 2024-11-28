package com.businessapi.dto.requestDTOs;

import com.businessapi.entity.enums.EStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateUserStatusRequestDTO(
        @NotNull Long userId,
        @NotNull EStatus status
        ) {
}
