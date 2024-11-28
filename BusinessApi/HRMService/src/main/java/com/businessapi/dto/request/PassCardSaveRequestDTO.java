package com.businessapi.dto.request;

import java.time.LocalDate;
import java.time.LocalTime;

public record PassCardSaveRequestDTO(
        Long employeeId,
        String cardNumber) {
}
