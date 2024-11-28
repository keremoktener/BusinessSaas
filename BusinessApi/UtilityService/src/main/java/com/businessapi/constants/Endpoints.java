package com.businessapi.constants;

public class Endpoints
{

    // version
    public static final String VERSION = "/v1";

    //profiles
    public static final String DEV = "/dev";
    public static final String MICROSERVICE = "/utility";


    public static final String ROOT = DEV + VERSION + MICROSERVICE;

    //controllers

    public static final String BUG_REPORT = "/bug-report";
    public static final String FEED_BACK = "/feed-back";
    public static final String NOTIFICATIONS = "/notifications";
    //methods

    public static final String SAVE = "/save";
    public static final String DELETE = "/delete";
    public static final String UPDATE = "/update";
    public static final String FIND_ALL = "/find-all";
    public static final String GET_USER_FEEDBACK = "/get-user-feedback";
    public static final String REPORT = "/report";

    public static final String FIND_BY_ID = "/find-by-id";
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
    public static final String FEEDBACK = "/feedback";
    public static final String REOPEN_CASE = "/reopen-case";

    //Notification methods
    public static final String GET_ALL_NOTIFICATIONS_FOR_AUTHID = "/getallnotifications";
    public static final String GET_ALL_UNREAD_NOTIFICATIONS_FOR_AUTHID = "/getallunreadnotifications";

    public static final String GET_UNREAD_COUNT = "/getunreadcount";
    public static final String GET_NOTIFICATION_FOR_USERID = "/getnotificationforuserid";
    public static final String CREATE_NOTIFICATION = "/createnotification";
    public static final String READ = "/read";
}
