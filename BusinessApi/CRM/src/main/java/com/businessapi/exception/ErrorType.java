package com.businessapi.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public enum ErrorType {

    // Server errors
    INTERNAL_SERVER_ERROR(1000,"An unexpected error occurred on the server, please try again",HttpStatus.INTERNAL_SERVER_ERROR),
    INTERNAL_ERROR(1001,"An unexpected error occurred on the server, please try again",HttpStatus.INTERNAL_SERVER_ERROR ),
    BAD_REQUEST_ERROR(1002, "The information entered is incomplete or incorrect.",HttpStatus.BAD_REQUEST),

    // Token errors
    INVALID_TOKEN(2000, "Invalid token", HttpStatus.BAD_REQUEST),

    // Customer errors
    CUSTOMER_EMAIL_EXIST(3000,"The email already exists" , HttpStatus.BAD_REQUEST),
    NOT_FOUNDED_CUSTOMER(3001,"The customer not found" ,HttpStatus.NOT_FOUND ),
    CUSTOMER_NOT_ACTIVE(3002,"The customer may be inactive or deleted" ,HttpStatus.BAD_REQUEST ),
    CUSTOMER_ALREADY_DELETED(3004,"The customer already deleted" ,HttpStatus.BAD_REQUEST ),
    EMAIL_ALREADY_EXISTS(3004,"Customer email already exists" , HttpStatus.BAD_REQUEST ),
    CUSTOMER_NOT_FOUND_ID(3005,"Customer IDs must not be null or empty" ,HttpStatus.BAD_REQUEST ),
     CUSTOMER_ALREADY_EXIST(3006,"Customer already exist" ,HttpStatus.BAD_REQUEST),

    // Marketing campaign errors
    MARKETING_CAMPAIGN_ALREADY_DELETED(4000,"The marketing campaign already deleted" ,HttpStatus.BAD_REQUEST );





    private Integer code;
    private String message;
    private HttpStatus httpStatus;
}
