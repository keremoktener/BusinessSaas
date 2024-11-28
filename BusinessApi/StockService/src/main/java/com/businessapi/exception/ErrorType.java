package com.businessapi.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public enum ErrorType
{


    INTERNAL_SERVER_ERROR(9000, "Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR),

    BAD_REQUEST_ERROR(9001, "Bad Request", HttpStatus.BAD_REQUEST),
    WAREHOUSE_NOT_FOUND(9002, "Ware House Not Found", HttpStatus.BAD_REQUEST),
    PRODUCT_NOT_FOUND(9003, "Product Not Found", HttpStatus.BAD_REQUEST),
    INSUFFICIENT_STOCK(9004, "Insufficient Stock", HttpStatus.BAD_REQUEST),
    PRODUCT_NOT_ACTIVE(9005, "Product Not Active", HttpStatus.BAD_REQUEST),
    ORDER_NOT_FOUND(9006, "Order Not Found", HttpStatus.BAD_REQUEST),
    PRODUCT_CATEGORY_NOT_FOUND(9007, "Product Category Not Found", HttpStatus.BAD_REQUEST),
    STOCK_MOVEMENT_NOT_FOUND(9008, "Stock Movement Not Found", HttpStatus.BAD_REQUEST),
    SUPPLIER_NOT_FOUND(9009, "Supplier Not Found", HttpStatus.BAD_REQUEST),
    INVALID_TOKEN(9010, "Invalid Token", HttpStatus.BAD_REQUEST),
    INCORRECT_BUY_ORDER_TYPE(9011, "Incorrect Buy Order Type. Buy Orders Can Not Have Customer Id", HttpStatus.BAD_REQUEST),
    INCORRECT_SELL_ORDER_TYPE(9012, "Incorrect Sell Order Type. Sell Orders Can Not Have Supplier Id", HttpStatus.BAD_REQUEST),
    ORDER_NOT_ACTIVE(9013, "Order Not Active", HttpStatus.BAD_REQUEST),
    WRONG_ORDER_TYPE(9014, "Wrong Order Type", HttpStatus.BAD_REQUEST),
    CUSTOMER_NOT_FOUND(9015, "Customer Not Found", HttpStatus.BAD_REQUEST),
    EMAIL_ALREADY_EXISTS(9016, "Email Already Exists", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED(9017, "Unauthorized", HttpStatus.UNAUTHORIZED),
    SUPPLIER_EMAIL_ALREADY_EXISTS(9018, "Supplier Email Already Exists", HttpStatus.BAD_REQUEST),
    PRODUCT_CATEGORY_ALREADY_EXISTS(9019, "Product Category Already Exists", HttpStatus.BAD_REQUEST),
    ORDER_NOT_BUY(9020, "Order Type Should Be Buy", HttpStatus.BAD_REQUEST),
    ORDER_ALREADY_ARRIVED(9021, "Order Already Arrived", HttpStatus.BAD_REQUEST),
    INVALID_EMAIL(9022, "Email Format Is Invalid", HttpStatus.BAD_REQUEST),
    ORDER_CAN_NOT_BE_DELETED(9023, "Order Arrived Or Approved Can Not Be Deleted", HttpStatus.BAD_REQUEST),
    ORDER_CAN_NOT_BE_UPDATED(9024, "Order Arrived Or Approved Can Not Be Updated", HttpStatus.BAD_REQUEST),
    STOCK_MOVEMENT_CAN_NOT_BE_DELETED(9025, "Stock Movement Can Not Be Deleted", HttpStatus.BAD_REQUEST),
    VALUE_CAN_NOT_BE_BELOW_ZERO(9026, "Value Can Not Be Below Zero", HttpStatus.BAD_REQUEST),
    IDENTITY_NO_ALREADY_EXISTS(9027, "Identity No Already Exists", HttpStatus.BAD_REQUEST);

    private Integer code;
    private String message;
    private HttpStatus httpStatus;
}
