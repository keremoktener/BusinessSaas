package com.businessapi.dto.response;

import lombok.Builder;

import java.time.LocalDate;

@Builder
public record BirthDateResponseDTO(
        String firstName,
        String lastName,
        String birthDate
        ) {
}
