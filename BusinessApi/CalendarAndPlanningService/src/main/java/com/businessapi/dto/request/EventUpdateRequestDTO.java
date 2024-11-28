package com.businessapi.dto.request;

import java.time.LocalDateTime;
import java.util.Set;

public record EventUpdateRequestDTO(String token, Long id, String title, String description, String location, LocalDateTime startDateTime, LocalDateTime endDateTime, Set<Long> invitedUserIds) {
}
