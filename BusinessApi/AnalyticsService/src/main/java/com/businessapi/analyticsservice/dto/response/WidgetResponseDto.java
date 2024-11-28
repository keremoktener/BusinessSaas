package com.businessapi.analyticsservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class WidgetResponseDto {

    private Long id;
    private String type;
    private String data;
    private Long dashboardId;
}

