package com.businessapi.dto.request;

import java.time.LocalDate;

public record SalesActivityUpdateDTO(Long opportunityId,
                                     String type,
                                     LocalDate date,
                                     String notes,
                                     Long id) {
}
