package com.businessapi.exception;

import lombok.Getter;


@Getter
public class AuthServiceException extends RuntimeException{
     private ErrorType errorType;
    public AuthServiceException(ErrorType errorType){
        super(errorType.getMessage());
        this.errorType = errorType;
    }
}
