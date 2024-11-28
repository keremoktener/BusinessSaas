package com.businessapi.dto.request;

import com.businessapi.entity.enums.EStatus;
import com.businessapi.entity.enums.ESubscriptionType;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record SubscriptionHistoryRequestDto (

    Long authId,
    ESubscriptionType subscriptionType,
    EStatus status,
    LocalDateTime startDate,
    LocalDateTime endDate,
    LocalDateTime cancellationDate,
    String planName,
    Double planPrice,
    String planDescription
) {


}
