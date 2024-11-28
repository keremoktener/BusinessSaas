package com.businessapi.dto.request;

import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
@Builder
public record AttendanceSaveRequestDTO(
        Long employeeId,
        LocalDate date,
        LocalTime checkInTime,
        LocalTime checkOutTime) {
}
