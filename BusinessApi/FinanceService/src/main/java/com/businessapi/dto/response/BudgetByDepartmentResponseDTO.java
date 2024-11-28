package com.businessapi.dto.response;

import com.businessapi.entity.enums.EBudgetCategory;

import java.math.BigDecimal;

public record BudgetByDepartmentResponseDTO(
        Long id,
        EBudgetCategory budgetCategory,
        BigDecimal subAmount,
        String description
) {
}
