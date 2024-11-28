package com.businessapi.dto.requestDTOs;

public record AddRoleToUserRequestDTO(
        Long userId,
        Long roleId
) {
}
