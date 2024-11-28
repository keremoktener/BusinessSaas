package com.businessapi.dto.request;

import jakarta.persistence.Column;

public record UpdateFaqRequestDto(
        @Column(nullable = false)
        Long id,
        @Column(nullable = false)
        String question,
        @Column(nullable = false)
         String answer
) {
}
