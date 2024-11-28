package com.businessapi.dto.response;

import com.businessapi.entity.enums.ERoles;

import java.util.List;

public record PlanGetResponseDTO(
    Long id,
    Double price,
    List<ERoles> roles,
    String description,
    String name
) {
}
