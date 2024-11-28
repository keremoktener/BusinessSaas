package com.businessapi.exception;

import lombok.Getter;


@Getter
public class CalendarAndPlannigServiceException extends RuntimeException{
     private ErrorType errorType;
    public CalendarAndPlannigServiceException(ErrorType errorType){
        super(errorType.getMessage());
        this.errorType = errorType;
    }
}
