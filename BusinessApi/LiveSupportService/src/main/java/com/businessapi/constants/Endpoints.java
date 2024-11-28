package com.businessapi.constants;

public class Endpoints
{

    // version
    public static final String VERSION = "/v1";

    //profiles
    public static final String DEV = "/dev";
    public static final String MICROSERVICE = "/live-support";


    public static final String ROOT = DEV + VERSION + MICROSERVICE;

    //controllers

    public static final String MESSAGE = "/message";
    public static final String FAQ = "/faq";
    public static final String QUEUE = "/queue";

    public static final String APP = "/app";

    //methods
    public static final String SEND_MESSAGE = "/sendMessage";
    public static final String QUEUE_MESSAGES = "/queue/messages";
    public static final String FIND_ALL = "/find-all";
    public static final String FIND_ALL_CONVERSATION = "/find-all-conversation";
    public static final String SAVE = "/save";
    public static final String DELETE = "/delete";
    public static final String UPDATE = "/update";

}
