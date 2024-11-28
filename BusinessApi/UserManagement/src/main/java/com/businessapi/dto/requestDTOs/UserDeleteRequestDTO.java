package com.businessapi.dto.requestDTOs;

import com.businessapi.constants.messages.ErrorMessages;
import jakarta.validation.constraints.NotBlank;


public record UserDeleteRequestDTO(
        @NotBlank(message = ErrorMessages.USER_ID_CANT_BE_BLANK)
        Long userId
) {

}
