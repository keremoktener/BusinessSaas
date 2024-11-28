package com.businessapi.constants;

public class EndPoints {

    public static final String VERSION = "/v1";

    public static final String DEV= "/dev";

    public static final String ROOT = DEV+VERSION;

    public static final String EVENT = ROOT+"/event";

    public static final String SAVE = "/save-event";
    public static final String UPDATE = "/update-event";
    public static final String DELETE_EVENT_BY_CREATOR = "/delete-event-by-creator";
    public static final String DELETE_EVENT_BY_INVITEE = "/delete-event-by-invitee";

    public static final String FIND_ALL_BY_AUTH_ID = "/find-all-by-auth-id";




}
