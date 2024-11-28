package com.businessapi.analyticsservice.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorType {

    BAD_REQUEST_ERROR(1001, "Invalid input parameters. Please correct them.", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED_REQUEST(5005, "Unauthorized request", HttpStatus.UNAUTHORIZED),
    INVALID_TOKEN(5006, "Invalid token", HttpStatus.UNAUTHORIZED),
    TOKEN_CREATION_FAILED(5007, "Token creation failed", HttpStatus.SERVICE_UNAVAILABLE),
    TOKEN_VERIFY_FAILED(5008, "Token verification failed", HttpStatus.SERVICE_UNAVAILABLE),
    TOKEN_FORMAT_NOT_ACCEPTABLE(5009, "Token format not acceptable", HttpStatus.BAD_REQUEST),
    DATA_NOT_FOUND(500001, "Data not found", HttpStatus.NOT_FOUND),
    INTERNAL_SERVER_ERROR(1002, "Server error during activation process.", HttpStatus.INTERNAL_SERVER_ERROR),
    TOKEN_ARGUMENT_NOT_VALID(2004, "Token argument is in an invalid format.", HttpStatus.BAD_REQUEST);

    private final Integer code;
    private final String message;
    private final HttpStatus httpStatus;
}
