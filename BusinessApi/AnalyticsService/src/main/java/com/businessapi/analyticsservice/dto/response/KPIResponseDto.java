package com.businessapi.analyticsservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class KPIResponseDto {
    private Long id;
    private String name;
    private String value;
    private String calculationMethod;
}
