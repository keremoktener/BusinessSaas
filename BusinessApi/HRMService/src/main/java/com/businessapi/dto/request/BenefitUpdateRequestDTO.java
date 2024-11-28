package com.businessapi.dto.request;

import java.time.LocalDate;

public record BenefitUpdateRequestDTO(
        Long id,
        String type,
        Double amount,
        LocalDate startDate,
        LocalDate endDate) {
}
