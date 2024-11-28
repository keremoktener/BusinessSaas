package com.businessapi.dto.request;

import com.businessapi.entity.enums.EFinancialReportType;

import java.math.BigDecimal;
import java.time.LocalDate;

public record FinancialReportUpdateRequestDTO(
        Long id,
        EFinancialReportType financialReportType,
        LocalDate startDate,
        LocalDate endDate,
        BigDecimal totalIncome,
        BigDecimal totalOutcome,
        BigDecimal totalProfit
) {
}
