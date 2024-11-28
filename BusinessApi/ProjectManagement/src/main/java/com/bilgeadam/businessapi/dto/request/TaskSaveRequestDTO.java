package com.bilgeadam.businessapi.dto.request;

import com.bilgeadam.businessapi.entity.enums.EPriority;
import com.bilgeadam.businessapi.entity.enums.EStatus;

public record TaskSaveRequestDTO(String name, String description, Long assignedUserId, EPriority priority, EStatus status, Long projectId){}

