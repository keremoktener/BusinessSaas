package com.businessapi.dto.request;

import com.businessapi.entity.enums.EInvoiceStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

public record InvoiceUpdateRequestDTO(
        Long id,
        String buyerTcNo,
        String buyerEmail,
        String buyerPhone,
        Long productId,
        String productName,
        Integer quantity,
        LocalDate invoiceDate,
        BigDecimal totalAmount
) {
}
