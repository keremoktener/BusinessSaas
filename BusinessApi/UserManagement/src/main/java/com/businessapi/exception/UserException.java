package com.businessapi.exception;

import lombok.Getter;

@Getter
public class UserException extends RuntimeException{
     private ErrorType errorType;
    public UserException(ErrorType errorType){
        super(errorType.getMessage());
        this.errorType = errorType;
    }
}
