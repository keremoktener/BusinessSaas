package com.businessapi.analyticsservice.entity.hrmService.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class Benefit {
    private Long employeeId;
    private String type;
    private BigDecimal amount;
    private LocalDate startDate;
    private LocalDate endDate;
}

