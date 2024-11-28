package com.businessapi.dto.response;

import com.businessapi.entities.enums.EOrderType;
import com.businessapi.entities.enums.EStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record SupplierOrderResponseDTO(Long id,
                                       String productName,
                                       BigDecimal unitPrice,
                                       Integer quantity,
                                       BigDecimal total,
                                       EOrderType orderType,
                                       LocalDateTime createdAt,
                                       EStatus status)
{
}
