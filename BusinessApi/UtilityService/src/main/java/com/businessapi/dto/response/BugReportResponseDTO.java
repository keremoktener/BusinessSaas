package com.businessapi.dto.response;

import com.businessapi.entities.enums.EBugStatus;

import java.time.LocalDateTime;

public record BugReportResponseDTO(Long id,
                                   String email,
                                   String subject,
                                   String description,
                                   String adminFeedback,
                                   LocalDateTime resolvedAt,
                                   EBugStatus bugStatus,
                                   String version

)
{
}
