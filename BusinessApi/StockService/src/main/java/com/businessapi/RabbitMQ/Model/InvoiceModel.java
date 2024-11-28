package com.businessapi.RabbitMQ.Model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class InvoiceModel {
    String buyerTcNo;
    String buyerEmail;
    String buyerPhone;
    Long productId;
    String productName;
    Integer quantity;
    BigDecimal price;
    BigDecimal totalAmount;
    LocalDate invoiceDate;
}
