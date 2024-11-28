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
    BAD_REQUEST_ERROR(1001, "The provided parameters are incorrect. Please correct them and try again.", HttpStatus.BAD_REQUEST),
    ERROR_CREATE_TOKEN(1002, "Token creation error. Please try again.", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_TOKEN(1003, "The provided token is invalid. Please try again.", HttpStatus.UNAUTHORIZED),
    USER_NOT_FOUND(1004, "User not found. Please try again.", HttpStatus.NOT_FOUND),
    TOKEN_CREATION_FAILED(1005,"token creation failed", HttpStatus.SERVICE_UNAVAILABLE),
    TOKEN_VERIFY_FAILED(1006,"token verify failed", HttpStatus.SERVICE_UNAVAILABLE),
    TOKEN_FORMAT_NOT_ACCEPTABLE(1007,"token format not acceptable", HttpStatus.BAD_REQUEST),
    EVENT_NOT_FOUND(1008, "Event not found. Please try again.", HttpStatus.NOT_FOUND),
    EVENT_IS_NOT_ACTIVE(1009, "Event is not active. Please try again.", HttpStatus.NOT_FOUND),
    INVALID_INVITATION_ERROR(1010, "User is not invited to the event", HttpStatus.BAD_REQUEST),
    EVENT_UPDATE_PERMISSION_ERROR(1011,  "You do not have permission to update this event.", HttpStatus.BAD_REQUEST)
    ;





    private Integer code;
    private String message;
    private HttpStatus httpStatus;
}
