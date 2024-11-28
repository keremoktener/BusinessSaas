package com.businessapi.dto.request;

public record EmployeeSaveRequestDto(
    Long managerId,
    Long departmentId,
    String identityNo,
    String phoneNo,
    String name,
    String title,
    String surname,
    String email
)
{
}
