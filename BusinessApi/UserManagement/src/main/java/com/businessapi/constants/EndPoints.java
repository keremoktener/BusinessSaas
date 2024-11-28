package com.businessapi.constants;

public class EndPoints {



    public static final String VERSION = "/v1";

    public static final String DEV= "/dev";

    public static final String ROOT = DEV+VERSION;
    public static final String SERVICE = "/usermanagement";

    public static final String USER = ROOT+SERVICE+"/user";

    public static final String SAVE = "/save-user";
    public static final String UPDATE = "/update-user";
    public static final String DELETE = "/delete-user";



    public static final String ROLE = ROOT+SERVICE+"/role";

    public static final String CREATE_USER_ROLE = "/create-user-role";
    public static final String UPDATE_USER_ROLE = "/update-user-role";
    public static final String DELETE_USER_ROLE = "/delete-user-role";
    public static final String GET_ALL_USER_ROLES = "/get-all-user-roles";


}
