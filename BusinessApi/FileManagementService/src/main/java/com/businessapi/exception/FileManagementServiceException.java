package com.businessapi.exception;

import lombok.Getter;


@Getter
public class FileManagementServiceException extends RuntimeException{
     private ErrorType errorType;
    public FileManagementServiceException(ErrorType errorType){
        super(errorType.getMessage());
        this.errorType = errorType;
    }
}
