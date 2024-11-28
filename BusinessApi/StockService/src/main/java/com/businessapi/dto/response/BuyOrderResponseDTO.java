package com.businessapi.dto.response;

import com.businessapi.entities.enums.EOrderType;
import com.businessapi.entities.enums.EStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record BuyOrderResponseDTO(
    Long id,
    String supplierName,
    String email,
    String productName,
    BigDecimal unitPrice,
    Integer quantity,
    BigDecimal total,
    EOrderType orderType,
    LocalDateTime createdAt,
    EStatus status)
{
}
