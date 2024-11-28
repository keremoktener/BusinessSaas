package com.businessapi.analyticsservice.entity.financeService.entity;

import com.businessapi.analyticsservice.entity.financeService.enums.EFinancialReportType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class FinancialReport {
    private Long id;
    private EFinancialReportType financialReportType;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private double totalIncome;
    private double totalOutcome;
    private double totalProfit;
}