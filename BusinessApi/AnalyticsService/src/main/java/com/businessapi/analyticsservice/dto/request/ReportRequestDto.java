package com.businessapi.analyticsservice.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class ReportRequestDto {

    private String name;
    private String description;
    private Long dataSourceId;
    private String filters;
}

