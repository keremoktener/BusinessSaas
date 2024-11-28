package com.businessapi.constants;

public class EndPoints {



    private static final String VERSION = "/v1";
    private static final String DEV = "/dev";



    private static final String ROOT = DEV+ VERSION;

    public static final String PASSCARD = ROOT + "/pass-card";
    public static final String ATTENDANCE = ROOT + "/attendance";
    public static final String BENEFIT= ROOT + "/benefit";
    public static final String EMPLOYEE= ROOT + "/employee";
    public static final String PAYROLL= ROOT + "/payroll";
    public static final String PERFORMANCE= ROOT + "/performance";

    public static final String SAVE = "/save";
    public static final String DELETE = "/delete";
    public static final String UPDATE = "/update";
    public static final String FIND_ALL = "/find-all";
    public static final String NUMBER_MEN = "/number-men";
    public static final String NUMBER_WOMEN = "/number-women";
    public static final String NUMBER_DEPARTMENTS = "/number-departments";
    public static final String DEPARTMENT_SCORE = "/department-score";
    public static final String BIRTHDATE_LIST = "/birthdate-list";
    public static final String CHECK_IN_TIME = "/check-in-time";
    public static final String CHECK_OUT_TIME = "/check-out-time";
    public static final String FIND_BY_ID = "/find-by-id";
    public static final String SEARCH_BY_NAME = "/search-by-name";


}

