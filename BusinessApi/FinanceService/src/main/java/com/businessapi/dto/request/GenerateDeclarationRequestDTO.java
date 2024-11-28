package com.businessapi.dto.request;

import java.math.BigDecimal;
import java.time.LocalDate;

public record GenerateDeclarationRequestDTO(
        String taxType,
        BigDecimal totalIncome,
        BigDecimal totalExpense,
        LocalDate startDate,
        LocalDate endDate
) {
}
