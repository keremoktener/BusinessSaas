package com.businessapi.dto.request;

import java.time.LocalDate;


public record TicketUpdateDTO(Long customerId,
                              String subject,
                              String description,
                              String ticketStatus,
                              String priority,
                              LocalDate createdDate,
                              LocalDate closedDate,
                              Long id) {
}
