package com.businessapi.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public enum ErrorType
{
    INTERNAL_SERVER_ERROR(9000, "Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR),
    BAD_REQUEST_ERROR(9001, "Bad Request", HttpStatus.BAD_REQUEST),
    INVALID_TOKEN(9002, "Invalid Token", HttpStatus.BAD_REQUEST),
    ;

    private Integer code;
    private String message;
    private HttpStatus httpStatus;
}
