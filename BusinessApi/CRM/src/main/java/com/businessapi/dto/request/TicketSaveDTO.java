package com.businessapi.dto.request;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record TicketSaveDTO( Long customerId,
         String subject,
         String description,
         String ticketStatus,
         String priority,
         LocalDate createdDate,
         LocalDate closedDate) {
}
