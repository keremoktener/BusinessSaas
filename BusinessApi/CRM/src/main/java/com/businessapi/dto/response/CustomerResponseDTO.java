package com.businessapi.dto.response;

import lombok.Builder;

@Builder
public record CustomerResponseDTO(Long id,String firstName, String lastName, String email, String phone, String address) {
}
