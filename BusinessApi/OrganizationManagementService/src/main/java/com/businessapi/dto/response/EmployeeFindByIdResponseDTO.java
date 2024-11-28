package com.businessapi.dto.response;

public record EmployeeFindByIdResponseDTO(
        Long id,
        Long managerId,
        Long departmentId,
        String identityNo,
        String phoneNo,
        String name,
        String surname,
        String email,
        String title,
        Boolean isEmployeeTopLevelManager,
        Boolean isAccountGivenToEmployee
)
{
}
