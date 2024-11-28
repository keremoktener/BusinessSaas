package com.businessapi.dto.request;

public record SubordinateSaveRequestDTO(
    Long managerId,
    Long departmentId,
    String identityNo,
    String phoneNo,
    String title,
    String name,
    String surname,
    String email
)
{
}
