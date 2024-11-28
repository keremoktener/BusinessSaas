package com.businessapi.dto.request;

import com.businessapi.entity.enums.ETaxType;

import java.math.BigDecimal;

public record TaxUpdateRequestDTO(
        Long id,
        ETaxType taxType,
        BigDecimal taxRate,
        String description
) {
}
