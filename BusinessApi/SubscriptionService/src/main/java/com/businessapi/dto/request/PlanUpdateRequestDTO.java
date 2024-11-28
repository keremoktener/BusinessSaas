package com.businessapi.dto.request;

import com.businessapi.entity.PlanTranslation;
import com.businessapi.entity.enums.ERoles;

import java.util.List;

public record PlanUpdateRequestDTO(
    Long id,
    Double price,
    List<ERoles> roles,
    List<PlanTranslation> translations
){
}
