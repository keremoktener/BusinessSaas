package com.businessapi.dto.response;

public record CustomerSaveRequestDTO(
        String identityNo,
        String phoneNo,
        String name,
        String surname,
        String email
)
{
}
