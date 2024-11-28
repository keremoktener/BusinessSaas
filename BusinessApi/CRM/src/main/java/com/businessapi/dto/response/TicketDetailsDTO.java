package com.businessapi.dto.response;

import com.businessapi.dto.request.CustomerDetailsDTO;
import lombok.Builder;

import java.util.List;
@Builder
public record TicketDetailsDTO(
        String subject,
        String description,
        String ticketStatus,
        String priority,
        String createdDate,
        String closedDate,
        List<CustomerDetailsDTO>customers
) {
}
