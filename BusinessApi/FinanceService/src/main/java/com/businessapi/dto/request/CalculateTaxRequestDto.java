package com.businessapi.dto.request;

import java.math.BigDecimal;

public record CalculateTaxRequestDto(
        Long id,
        BigDecimal amount
) {
}
