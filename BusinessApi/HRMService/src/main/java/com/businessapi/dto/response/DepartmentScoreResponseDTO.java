package com.businessapi.dto.response;

import lombok.Builder;

import java.time.LocalDate;

@Builder
public record DepartmentScoreResponseDTO(
       String department,
       Double averageScore) {
}
