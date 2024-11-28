package com.businessapi.dto.request;

import java.time.LocalDate;

public record PayrollUpdateRequestDTO(
        Long id,
        LocalDate salaryDate,
        Double grossSalary,
        Double deductions,
        Double netSalary) {
}
