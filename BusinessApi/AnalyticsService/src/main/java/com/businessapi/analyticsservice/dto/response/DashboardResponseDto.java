package com.businessapi.analyticsservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class DashboardResponseDto {

    private Long id;
    private String name;
    private List<WidgetResponseDto> widgets;
}

