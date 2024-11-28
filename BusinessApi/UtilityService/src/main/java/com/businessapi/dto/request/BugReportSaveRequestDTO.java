package com.businessapi.dto.request;

public record BugReportSaveRequestDTO(
        String subject,
        String description
)
{
}
