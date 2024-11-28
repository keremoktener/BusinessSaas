package com.businessapi.dto.request;

import java.time.LocalDate;

public record PerformanceSaveRequestDTO(
        Long employeeId,
        LocalDate date,
        Integer score,
        String feedback) {
}
