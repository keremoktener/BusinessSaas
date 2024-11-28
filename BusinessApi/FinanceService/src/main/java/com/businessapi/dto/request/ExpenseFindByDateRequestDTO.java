package com.businessapi.dto.request;

import java.time.LocalDate;

public record ExpenseFindByDateRequestDTO(
        LocalDate startDate,
        LocalDate endDate
) {
}
