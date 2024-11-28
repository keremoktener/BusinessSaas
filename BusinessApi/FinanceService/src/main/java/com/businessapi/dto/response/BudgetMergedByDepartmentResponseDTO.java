package com.businessapi.dto.response;

import java.math.BigDecimal;

public record BudgetMergedByDepartmentResponseDTO(
        Long id,
        BigDecimal totalAmount,
        BigDecimal spentAmount,
        String departmentName
) {
}
