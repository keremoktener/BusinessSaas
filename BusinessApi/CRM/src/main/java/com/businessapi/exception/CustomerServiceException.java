package com.businessapi.exception;

import lombok.Getter;

@Getter
public class CustomerServiceException extends RuntimeException {
    private final ErrorType errorType;
    public CustomerServiceException(ErrorType errorType){
        super(errorType.getMessage());
        this.errorType = errorType;
    }

    public CustomerServiceException(ErrorType errorType, String message){
        super(message);
        this.errorType = errorType;
    }
}
