package com.businessapi.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public enum ErrorType {

    INTERNAL_SERVER_ERROR(1000, "An unexpected error occurred on the server. Please try again.", HttpStatus.INTERNAL_SERVER_ERROR),
    BAD_REQUEST_ERROR(1005, "Invalid request. Please try again.", HttpStatus.BAD_REQUEST),
    INVALID_TOKEN(1006, "The provided token is invalid. Please try again.", HttpStatus.UNAUTHORIZED),
    FILE_NOT_FOUND( 1007, "File not found. Please try again.", HttpStatus.NOT_FOUND ),
    FILE_ALREADY_DELETED( 1008, "File already deleted. Please try again.", HttpStatus.BAD_REQUEST ),
    USER_HAS_NO_ACTIVE_FILES( 1009, "User has no active files. Please try again.", HttpStatus.BAD_REQUEST );












    private Integer code;
    private String message;
    private HttpStatus httpStatus;
}
