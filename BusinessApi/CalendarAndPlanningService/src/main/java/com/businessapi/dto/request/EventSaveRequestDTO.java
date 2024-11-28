package com.businessapi.dto.request;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.Set;

public record EventSaveRequestDTO(
        String token,
        Set<Long> invitedUserIds,
        String title,
        String description,
        String location,
        LocalDateTime startDateTime,
        LocalDateTime endDateTime) {
}
