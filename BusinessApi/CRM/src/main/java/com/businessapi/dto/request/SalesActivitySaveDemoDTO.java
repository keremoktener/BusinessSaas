package com.businessapi.dto.request;

import java.time.LocalDate;

public record SalesActivitySaveDemoDTO(Long opportunityId,
                                       String type,
                                       LocalDate date,
                                       String notes) {
}
