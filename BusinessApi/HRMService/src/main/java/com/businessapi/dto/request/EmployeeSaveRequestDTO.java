package com.businessapi.dto.request;

import java.time.LocalDate;

public record EmployeeSaveRequestDTO(
        String firstName,
        String lastName,
        String position,
        String department,
        String email,
        String phone,
        LocalDate birthDate,
        String gender,
        LocalDate hireDate,
        Double salary) {
}
