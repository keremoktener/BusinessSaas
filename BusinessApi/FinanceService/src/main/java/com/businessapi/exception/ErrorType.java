package com.businessapi.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public enum ErrorType {


    INTERNAL_SERVER_ERROR(9000,"Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR),

    BAD_REQUEST_ERROR(9001,"Bad Request",   HttpStatus.BAD_REQUEST ),
    WAREHOUSE_NOT_FOUND(9002,"Ware House Not Found" ,HttpStatus.BAD_REQUEST ),
    PRODUCT_NOT_FOUND(9003,"Product Not Found", HttpStatus.BAD_REQUEST  ),
    INSUFFICIENT_STOCK( 9004, "Insufficient Stock",  HttpStatus.BAD_REQUEST),
    PRODUCT_NOT_ACTIVE( 9005,  "Product Not Active" , HttpStatus.BAD_REQUEST),
    ORDER_NOT_FOUND(9006,"Order Not Found" ,    HttpStatus.BAD_REQUEST),
    PRODUCT_CATEGORY_NOT_FOUND(9007,    "Product Category Not Found" , HttpStatus.BAD_REQUEST),
    STOCK_MOVEMENT_NOT_FOUND(9008, "Stock Movement Not Found", HttpStatus.BAD_REQUEST),
    SUPPLIER_NOT_FOUND( 9009,  "Supplier Not Found" ,  HttpStatus.BAD_REQUEST),
    BUDGET_NOT_FOUND(9010, "Budget Not Found", HttpStatus.BAD_REQUEST),
    EXPENSE_NOT_FOUND(9011, "Expense Not Found", HttpStatus.BAD_REQUEST),
    FINANCIAL_REPORT_NOT_FOUND(9012, "Financial Report Not Found", HttpStatus.BAD_REQUEST),
    INVOICE_NOT_FOUND(9013, "Invoice Not Found", HttpStatus.BAD_REQUEST),
    TAX_NOT_FOUND(9014, "Tax Not Found", HttpStatus.BAD_REQUEST),
    INVALID_TOKEN(9015, "Invalid Token", HttpStatus.BAD_REQUEST),
    INCOME_NOT_FOUND(9016, "Income Not Found", HttpStatus.BAD_REQUEST),
    DEPARTMENT_NOT_FOUND(9017, "Department Not Found", HttpStatus.BAD_REQUEST),
    BUDGET_NOT_ENOUGH(9018, "Budget Not Enough", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED(9019, "Unauthorized", HttpStatus.UNAUTHORIZED),
    ACCESS_DENIED(9020, "Access Denied", HttpStatus.FORBIDDEN),;

    private Integer code;
    private String message;
    private HttpStatus httpStatus;
}
