package com.businessapi.analyticsservice.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class DataSourceRequestDto {

    private String name;
    private String type;
    private String connectionDetails;
}

