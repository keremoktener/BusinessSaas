package com.businessapi.dto.request;

import lombok.Builder;

@Builder
public record CustomerSaveLinkDTO(
        String firstName,
        String lastName,
        String email,
        String phone,
        String address,
        Long memberId

) {
}
