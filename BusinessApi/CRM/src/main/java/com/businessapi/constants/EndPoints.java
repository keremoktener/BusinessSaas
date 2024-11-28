package com.businessapi.constants;

public class EndPoints {
    public static final String VERSION="/v1";
    //profiles:
    public static final String API="/api";
    public static final String DEV="/dev";
    public static final String TEST="/test";


    public static final String MICROSERVICE = "/crm";


    public static final String ROOT = DEV + VERSION + MICROSERVICE;

    //entities:
    public static final String CUSTOMER=ROOT+"/customer";
    public static final String TICKET=ROOT+"/ticket";
    public static final String OPPORTUNITY=ROOT+"/opportunity";
    public static final String ACTIVITIES=ROOT+"/activities";
    public static final String MARKETINGCAMPAIGN=ROOT+"/marketing-campaign";
    public static final String SAVE = "/save";
    public static final String FINDALL = "/find-all";
    public static final String FINDBYID = "/find-by-id";
    public static final String UPDATE = "/update";
    public static final String DELETE = "/delete";
    public static final String FOR_OPPORTUNITY = "/for-opportunity";
    public static final String SAVECUSTOMER = "/save-customer";
    public static final String GETDETAILS = "/get-details";
    public static final String UPLOAD_EXCEL_CUSTOMER = "/upload-excel-customer";


    public static final String SAVE_EXTERNAL_SOURCE_CUSTOMER = "/save-external-source-customer";
    public static final String SEND_EMAIL_EXTERNAL_SOURCE_CUSTOMER = "/send-email-external-source-customer"; ;
    ;
}
