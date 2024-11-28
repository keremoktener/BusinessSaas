package com.businessapi.dto.request;

import java.time.LocalDate;

public record PayrollSaveRequestDTO(

        Long employeeId,
        LocalDate salaryDate,
        Double grossSalary,
        Double deductions,
        Double netSalary) {
}
