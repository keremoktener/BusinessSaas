package com.businessapi.dto.request;

import lombok.Builder;

import java.util.List;

@Builder
public record OpportunityForCustomerSaveDTO(Long id, List<Long> customers) {
}
