package com.businessapi.entity;


import com.businessapi.entity.enums.EFinancialReportType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import java.math.BigDecimal;
import java.time.LocalDate;

@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "tblfinancialreport")
public class FinancialReport extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    Long memberId;

    @Enumerated(EnumType.STRING)
    EFinancialReportType financialReportType;

    LocalDate startDate;
    LocalDate endDate;
    BigDecimal totalIncome;
    BigDecimal totalOutcome;
    BigDecimal totalTax;
    BigDecimal totalProfit;
    String message;

}
