package com.businessapi.analyticsservice.entity.hrmService.entity;

import com.businessapi.analyticsservice.entity.hrmService.enums.EStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class Performance {
    private Long employeeId;
    private LocalDate date;
    private Integer score;
    private String feedback;
    @Enumerated(EnumType.STRING)
    private EStatus status;
}
