package com.bilgeadam.businessapi.dto.request;

import com.bilgeadam.businessapi.entity.Task;
import com.bilgeadam.businessapi.entity.enums.EStatus;

import java.util.List;

public record ProjectAddTaskRequestDTO(String name, String description, EStatus status, List<Task> tasks){}

