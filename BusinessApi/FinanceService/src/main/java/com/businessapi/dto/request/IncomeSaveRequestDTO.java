package com.businessapi.dto.request;

import java.math.BigDecimal;
import java.time.LocalDate;

public record IncomeSaveRequestDTO(
        String source,
        BigDecimal amount,
        LocalDate incomeDate
) {
}
