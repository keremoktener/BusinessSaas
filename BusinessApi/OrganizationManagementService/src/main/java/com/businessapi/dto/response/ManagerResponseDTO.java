package com.businessapi.dto.response;

public record ManagerResponseDTO(
        Long id,
        String departmentName,
        String identityNo,
        String phoneNo,
        String name,
        String surname,
        String email
)
{
}
