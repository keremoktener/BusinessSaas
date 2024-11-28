package com.businessapi.dto.request;

import java.util.List;

public record OpportunityUpdateDTO(
        Long id,
        String name,
        String description,
        Double value,
        String stage,
        Double probability,
        List<Long> customers,
        List<Long> customersToRemove
) {
}
