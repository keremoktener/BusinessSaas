package com.businessapi.analyticsservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class ReportResponseDto {

    private Long id;
    private String name;
    private String description;
    private LocalDateTime createdAt;
    private String filters;
    private Long dataSourceId;
}

