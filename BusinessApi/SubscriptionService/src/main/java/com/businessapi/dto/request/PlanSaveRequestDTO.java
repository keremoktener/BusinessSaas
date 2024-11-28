package com.businessapi.dto.request;

import com.businessapi.entity.PlanTranslation;
import com.businessapi.entity.enums.ERoles;
import lombok.Builder;

import java.util.List;
@Builder
public record PlanSaveRequestDTO (
        Double price,
        List<ERoles> roles,
        List<PlanTranslation> translations
){
}
