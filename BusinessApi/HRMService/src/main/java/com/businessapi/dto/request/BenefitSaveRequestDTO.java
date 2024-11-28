package com.businessapi.dto.request;

import java.time.LocalDate;

public record BenefitSaveRequestDTO(
        Long employeeId,
        String type,
        Double amount,
        LocalDate startDate,
        LocalDate endDate) {
}
