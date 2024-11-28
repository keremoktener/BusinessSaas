package com.businessapi.dto.request;

import lombok.Builder;

import java.util.List;

@Builder
public record TicketForCustomerSaveDTO(Long id, List<Long> customers) {
}
