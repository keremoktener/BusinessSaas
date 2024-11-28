package com.businessapi.dto.response;

import com.businessapi.entity.enums.EExpenseCategory;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ExpenseResponseDTO(
        Long id,
        EExpenseCategory expenseCategory,
        LocalDate expenseDate,
        BigDecimal amount,
        String description,
        String departmentName
) {
}
