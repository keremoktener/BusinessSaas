package com.businessapi.dto.response;

import com.businessapi.entity.enums.EStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

public record DeclarationResponseDTO(
        Long id,
        LocalDate startDate,
        LocalDate endDate,
        BigDecimal totalIncome,
        BigDecimal totalExpense,
        BigDecimal netIncome,
        BigDecimal totalTax,
        String taxType,
        EStatus status
) {
}
