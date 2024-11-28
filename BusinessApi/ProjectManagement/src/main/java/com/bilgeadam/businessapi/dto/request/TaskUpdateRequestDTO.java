package com.bilgeadam.businessapi.dto.request;

import com.bilgeadam.businessapi.entity.Project;
import com.bilgeadam.businessapi.entity.enums.EPriority;
import com.bilgeadam.businessapi.entity.enums.EStatus;

public record TaskUpdateRequestDTO(Long id,
                                   String name,
                                   String description,
                                   Long assignedUserId,
                                   EPriority priority,
                                   EStatus status){}
