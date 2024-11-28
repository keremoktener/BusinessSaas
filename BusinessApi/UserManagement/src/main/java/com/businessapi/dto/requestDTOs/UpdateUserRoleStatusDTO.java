package com.businessapi.dto.requestDTOs;

import com.businessapi.entity.enums.EStatus;
import jakarta.validation.constraints.NotBlank;

public record UpdateUserRoleStatusDTO(
         Long roleId,
         EStatus status
        ) {
}
