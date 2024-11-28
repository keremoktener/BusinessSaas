package com.businessapi.dto.request;

import java.time.LocalDate;

import java.time.LocalTime;

public record AttendanceUpdateRequestDTO(
        Long id,
        LocalDate date,
        LocalTime checkInTime,
        LocalTime checkOutTime) {
}
