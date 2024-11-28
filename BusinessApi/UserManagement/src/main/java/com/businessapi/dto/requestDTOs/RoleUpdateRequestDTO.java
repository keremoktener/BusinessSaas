package com.businessapi.dto.requestDTOs;

import com.businessapi.constants.messages.ErrorMessages;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


public record RoleUpdateRequestDTO(

        Long roleId,
        @Size(max = 60)
        @NotBlank(message = ErrorMessages.ROLE_CANT_BE_BLANK)
        String roleName,
        @Size(max = 500)
        String roleDescription
) {

}
