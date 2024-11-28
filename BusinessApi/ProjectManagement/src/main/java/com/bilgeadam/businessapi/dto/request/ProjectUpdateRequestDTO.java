package com.bilgeadam.businessapi.dto.request;

import com.bilgeadam.businessapi.entity.enums.EStatus;

public record ProjectUpdateRequestDTO ( Long id, String name, String description, EStatus status){}
