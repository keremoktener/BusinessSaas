package com.businessapi.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public enum ErrorType {

    BAD_REQUEST_ERROR(1001, "Girilen bilgiler eksik ya da yanlıştır.",HttpStatus.BAD_REQUEST),
    BAD_REQUEST_REPASSWORD_ERROR(1002, "Girilen şifreler uyuşmuyor.",HttpStatus.BAD_REQUEST),
    BAD_REQUEST_USERNAME_OR_PASSWORD_ERROR(1003, "Kullanıcı ad ya da şifresi hatalıdır.", HttpStatus.BAD_REQUEST),

    INTERNAL_SERVER_ERROR(9998,"Sunucuda beklenmeyen bir hata oluştu, Lütfen tekrar deneyiniz",HttpStatus.INTERNAL_SERVER_ERROR),
    INTERNAL_SERVER_ERROR_NOT_FOUND_DATA(9002,"Sunucu Hatası: Liste getirilemedi, lütfen tekrar deneyin", HttpStatus.INTERNAL_SERVER_ERROR),

    POST_NOT_FOUND(8888, "Post bulunamadı.", HttpStatus.NOT_FOUND),

    FOLLOW_DATA_NOT_FOUND(999,"Follow datası bulunamadı", HttpStatus.NOT_FOUND),

    INVALID_TOKEN(6001,"Token Geçersiz", HttpStatus.BAD_REQUEST),
    NOT_FOUNDED_ATTENDANCE(6005,"Attendance bulunamadı" ,  HttpStatus.BAD_REQUEST),


    NOT_FOUNDED_PERFORMANCE(6004, "Performance bulunamadı", HttpStatus.BAD_REQUEST),

    NOT_FOUNDED_EMPLOYEE(6000,"EMployee bulunamadı",HttpStatus.BAD_REQUEST),
    NOT_FOUNDED_BENEFIT(6003,"Benefit bulunamadı ",HttpStatus.BAD_REQUEST ),
    NOT_FOUNDED_PASSCARD(6006,"Geçiş kartı bulunamadı" ,HttpStatus.BAD_REQUEST ),
    NOT_FOUNDED_PAYROLL(6002,"Payroll bulunamadı" ,HttpStatus.BAD_REQUEST );





    private Integer code;
    private String message;
    private HttpStatus httpStatus;
}
