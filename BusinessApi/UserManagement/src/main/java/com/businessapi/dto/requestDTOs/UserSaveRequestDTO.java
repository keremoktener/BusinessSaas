package com.businessapi.dto.requestDTOs;

import com.businessapi.constants.messages.ErrorMessages;
import jakarta.validation.constraints.*;


import java.util.List;


public record UserSaveRequestDTO (

        @Size(max = 40, message = ErrorMessages.FIRST_NAME_CANT_EXCEED_LENGTH)
        @NotBlank(message = ErrorMessages.FIRST_NAME_CANT_BE_BLANK)
        String firstName,
        @Size(message = ErrorMessages.LAST_NAME_EXCEED_LENGTH)
        @NotBlank(message = ErrorMessages.LAST_NAME_CANT_BE_BLANK)
        String lastName,


        @Email(message = ErrorMessages.EMAIL_TYPE_IS_WRONG)
        @NotBlank (message = ErrorMessages.EMAIL_NOT_BLANK)
        String email,

        @NotBlank(message = ErrorMessages.PASSWORD_NOT_BLANK)
        String password,


        List<Long> roleIds
) {

}
