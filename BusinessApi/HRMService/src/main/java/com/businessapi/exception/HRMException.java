package com.businessapi.exception;

import lombok.Getter;


@Getter
public class HRMException extends RuntimeException{
     private ErrorType errorType;
    public HRMException(ErrorType errorType){
        super(errorType.getMessage());
        this.errorType = errorType;
    }
}
