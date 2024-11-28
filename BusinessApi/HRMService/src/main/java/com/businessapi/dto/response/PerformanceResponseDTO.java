package com.businessapi.dto.response;

import lombok.Builder;

import java.time.LocalDate;
@Builder
public record PerformanceResponseDTO(
        Long id,
        Long employeeId,
        String firstName,
        String lastName,
        LocalDate date,
        Integer score,
        String feedback) {
}
