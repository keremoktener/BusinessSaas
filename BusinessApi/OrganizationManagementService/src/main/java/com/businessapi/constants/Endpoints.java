package com.businessapi.constants;

public class Endpoints
{

    // version
    public static final String VERSION = "/v1";

    //profiles
    public static final String DEV = "/dev";
    public static final String MICROSERVICE = "/organization-management";


    public static final String ROOT = DEV + VERSION + MICROSERVICE;

    //controllers

    public static final String DEPARTMENT = "/department";
    public static final String EMPLOYEE = "/employee";
    public static final String MANAGER = "/manager";

    //methods

    public static final String SAVE = "/save";
    public static final String DELETE = "/delete";
    public static final String UPDATE = "/update";
    public static final String FIND_ALL = "/find-all";

    public static final String FIND_BY_ID = "/find-by-id";
    public static final String FIND_BY_MEMBER_ID = "/find-by-member-id";
    public static final String FIND_ALL_BY_MINIMUM_STOCK_LEVEL = "/find-all-by-minimum-stock-level";
    public static final String SAVE_BUY_ORDER = "/save-buy-order";
    public static final String SAVE_SELL_ORDER = "/save-sell-order";
    public static final String APPROVE_ORDER = "/approve-order";
    public static final String CHANGE_AUTO_ORDER_MODE = "/change-auto-order-mode";
    public static final String FIND_ALL_BUY_ORDERS = "/find-all-buy-orders";
    public static final String FIND_ALL_SELL_ORDERS = "/find-all-sell-orders";
    public static final String FIND_ORDERS_OF_SUPPLIER = "/find-orders-of-supplier";

    public static final String UPDATE_BUY_ORDER = "/update-buy-order";
    public static final String UPDATE_SELL_ORDER = "/update-sell-order";
    public static final String SAVE_FROM_ORDER_ID = "/save-from-order-id";

    public static final String GET_EMPLOYEE_HIERARCHY = "/get-employee-hierarchy";
    public static final String SAVE_SUBORDINATE = "/save-subordinate";
    public static final String SAVE_TOP_LEVEL_MANAGER = "/save-top-level-manager";
    public static final String CHANGE_IS_ACCOUNT_GIVEN_TO_EMPLOYEE_STATE = "/change-is-account-given-to-employee-state";
}
