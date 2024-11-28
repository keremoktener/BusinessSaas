package com.businessapi.analyticsservice.entity.financeService.entity;

import com.businessapi.analyticsservice.entity.financeService.enums.ETaxType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class Tax {
    private Long id;
    private ETaxType taxType;
    private double taxRate;
    private String description;
}
