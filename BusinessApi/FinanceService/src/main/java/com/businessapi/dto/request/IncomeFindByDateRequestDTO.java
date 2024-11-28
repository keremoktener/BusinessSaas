package com.businessapi.dto.request;

import java.time.LocalDate;

public record IncomeFindByDateRequestDTO(
        LocalDate startDate,
        LocalDate endDate
) {
}
