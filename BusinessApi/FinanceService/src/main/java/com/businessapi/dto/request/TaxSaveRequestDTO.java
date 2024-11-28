package com.businessapi.dto.request;

import com.businessapi.entity.enums.ETaxType;

import java.math.BigDecimal;

public record TaxSaveRequestDTO(
        ETaxType taxType,
        BigDecimal taxRate,
        String description
) {
}
