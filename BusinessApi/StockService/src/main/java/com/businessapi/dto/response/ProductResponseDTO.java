package com.businessapi.dto.response;

import com.businessapi.entities.enums.EStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProductResponseDTO(
    Long id,
    String supplierName,
    String wareHouseName,
    String productCategoryName,
    String name,
    String description,
    BigDecimal price,
    Integer stockCount,
    Integer minimumStockLevel,
    Boolean isAutoOrderEnabled,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    EStatus status
   )
{
}
