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
    INVALID_TOKEN(9010, "Invalid Token", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED(9017, "Unauthorized", HttpStatus.UNAUTHORIZED),
    BUG_REPORT_NOT_FOUND(9101, "Bug report not found", HttpStatus.NOT_FOUND),
    BUG_REPORT_STATUS_SHOULD_BE_OPEN_OR_IN_PROGRESS(9102, "Bug report status should be open or in progress", HttpStatus.BAD_REQUEST),
    BUG_REPORT_STATUS_SHOULD_BE_RESOLVED( 9103, "Bug report status should be resolved", HttpStatus.BAD_REQUEST),
    BUG_REPORT_STATUS_SHOULD_BE_OPEN_OR_RESOLVED( 9104, "Bug report status should be open or resolved",  HttpStatus.BAD_REQUEST),
    FEEDBACK_NOT_FOUND( 9105, "Feedback not found", HttpStatus.NOT_FOUND ),
    FEEDBACK_ALREADY_DELETED( 9106, "Feedback already deleted", HttpStatus.BAD_REQUEST),
    BUG_STATUS_UPDATE_NOT_ALLOWED(9105, "Bug status update not allowed", HttpStatus.BAD_REQUEST),
    BUG_STATUS_SHOULD_BE_OPEN(9106, "Bug status should be open", HttpStatus.BAD_REQUEST),
    BUG_REPORT_STATUS_SHOULD_BE_IN_PROGRESS(9107, "Bug report status should be in progress", HttpStatus.BAD_REQUEST),
    BUG_FEEDBACK_ALREADY_EXIST(9108, "Bug feedback already exist", HttpStatus.BAD_REQUEST),
    FEEDBACK_ALREADY_EXISTS( 9107, "Feedback already exists", HttpStatus.BAD_REQUEST),
    ;

    private Integer code;
    private String message;
    private HttpStatus httpStatus;
}
