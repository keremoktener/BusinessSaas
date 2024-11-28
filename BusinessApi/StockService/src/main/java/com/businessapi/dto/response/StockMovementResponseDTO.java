package com.businessapi.dto.response;

import com.businessapi.entities.enums.EStatus;
import com.businessapi.entities.enums.EStockMovementType;

import java.time.LocalDateTime;

public record StockMovementResponseDTO(
    Long id,
    String productName,
    String wareHouseName,
    Integer quantity,
    EStatus status,
    EStockMovementType stockMovementType,
    LocalDateTime createdAt)
{
}
