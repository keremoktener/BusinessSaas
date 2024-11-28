package com.businessapi.dto.request;

import com.businessapi.entity.enums.ERoles;
import com.businessapi.entity.enums.ESubscriptionType;

import java.time.LocalDate;
import java.util.List;

public record SubscriptionSaveRequestDTO(
        Long planId,
        ESubscriptionType subscriptionType
){
}
