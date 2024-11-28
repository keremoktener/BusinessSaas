package com.businessapi.dto.response;

import lombok.Builder;

import java.time.LocalDate;
@Builder
public record EmployeeResponseDTO(
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
