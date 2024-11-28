package com.businessapi.dto.request;

import java.time.LocalDate;

public record DeclarationSaveRequestDTO(
        LocalDate startDate,
        LocalDate endDate
) {
}
