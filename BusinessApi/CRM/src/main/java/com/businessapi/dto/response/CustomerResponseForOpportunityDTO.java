package com.businessapi.dto.response;

import lombok.Builder;

@Builder
public record CustomerResponseForOpportunityDTO(

        Long id,
        String firstName,
        String lastName,
        String email,
        String phone,
        String address
) {
}
