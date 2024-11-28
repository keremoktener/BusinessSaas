package com.businessapi.analyticsservice.entity.financeService.entity;

import com.businessapi.analyticsservice.entity.financeService.enums.EInvoiceStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class Invoice {
    private Long id;
    private Long customerIdOrSupplierId;
    private LocalDate invoiceDate;
    private double totalAmount;
    private double paidAmount;
    private EInvoiceStatus invoiceStatus;
    private String description;

}
