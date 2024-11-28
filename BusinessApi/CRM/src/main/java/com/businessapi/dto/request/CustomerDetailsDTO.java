package com.businessapi.dto.request;

import lombok.Builder;
import lombok.Data;

@Builder
public record CustomerDetailsDTO(
        String firstName,
        String lastName
) {
}
