package com.businessapi.analyticsservice.exception;

import lombok.Getter;

@Getter
public class AnalyticsServiceAppException extends RuntimeException{


    private ErrorType errorType;

    public AnalyticsServiceAppException(ErrorType errorType) {
        super(errorType.getMessage());
        this.errorType = errorType;
    }

    public AnalyticsServiceAppException(ErrorType errorType, String customMessage) {
        super(customMessage);
        this.errorType = errorType;
    }

}
