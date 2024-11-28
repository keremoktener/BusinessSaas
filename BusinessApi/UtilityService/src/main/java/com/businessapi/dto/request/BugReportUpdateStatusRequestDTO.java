package com.businessapi.dto.request;

import com.businessapi.entities.enums.EBugStatus;

public record BugReportUpdateStatusRequestDTO(
        Long id,
        EBugStatus bugStatus)
{
}
