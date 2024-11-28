package com.businessapi.dto.response;

import com.businessapi.entity.enums.EBudgetCategory;

import java.math.BigDecimal;

public record BudgetFindAllResponseDTO(
        Long id,
        BigDecimal totalAmount,
        BigDecimal subAmount,
        BigDecimal spentAmount,
        EBudgetCategory budgetCategory,
        String description,
        String departmentName
) {
}
