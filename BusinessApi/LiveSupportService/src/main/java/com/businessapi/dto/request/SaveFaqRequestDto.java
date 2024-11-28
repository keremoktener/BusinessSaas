package com.businessapi.dto.request;

import jakarta.persistence.Column;

public record SaveFaqRequestDto(
        @Column(nullable = false)
        String question,
        @Column(nullable = false)
         String answer
) {
}
