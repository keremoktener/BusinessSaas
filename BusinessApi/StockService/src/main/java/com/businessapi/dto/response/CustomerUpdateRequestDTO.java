package com.businessapi.dto.response;

public record CustomerUpdateRequestDTO(
        Long id,
        String identityNo,
        String phoneNo,
        String name,
        String surname,
        String email
)
{
}
