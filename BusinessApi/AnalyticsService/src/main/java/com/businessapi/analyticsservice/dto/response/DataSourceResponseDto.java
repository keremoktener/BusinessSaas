package com.businessapi.analyticsservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class DataSourceResponseDto {

    private Long id;
    private String name;
    private String type;
    private String connectionDetails;
}

