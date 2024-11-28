package com.businessapi.dto.response;

import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Builder
public record AttendanceResponseDTO(
        Long id,
        Long employeeId,
        String firstName,
        String lastName,
        LocalDate date,
        LocalTime checkInTime,
        LocalTime checkOutTime) {
}
