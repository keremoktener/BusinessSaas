package com.businessapi.analyticsservice.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class WidgetRequestDto {

    private String type;
    private String data;
    private Long dashboardId;
}

