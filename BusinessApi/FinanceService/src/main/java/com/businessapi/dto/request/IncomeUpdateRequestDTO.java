package com.businessapi.dto.request;

import java.math.BigDecimal;
import java.time.LocalDate;

public record IncomeUpdateRequestDTO(
        Long id,
        String source,
        BigDecimal amount,
        LocalDate incomeDate
) {
}
