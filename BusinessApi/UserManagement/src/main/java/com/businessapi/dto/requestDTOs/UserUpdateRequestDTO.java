package com.businessapi.dto.requestDTOs;

import com.businessapi.constants.messages.ErrorMessages;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;


public record UserUpdateRequestDTO(
        @NotNull(message = ErrorMessages.AUTH_ID_CANT_BE_NULL)
        Long authId,
        @Size(max = 40, message = ErrorMessages.FIRST_NAME_CANT_EXCEED_LENGTH)
        @NotBlank(message = ErrorMessages.FIRST_NAME_CANT_BE_BLANK)
        String firstName,
        @Size(message = ErrorMessages.LAST_NAME_EXCEED_LENGTH)
        @NotBlank(message = ErrorMessages.LAST_NAME_CANT_BE_BLANK)
        String lastName,
        @Email(message = ErrorMessages.EMAIL_TYPE_IS_WRONG)
        String email //TODO Bu auth servise gönderilecek
) {

}
