package com.businessapi.dto.request;

import java.time.LocalDate;


public record MarketingCampaignUpdateDTO(Long id,
                                         String name,
                                         String description,
                                         LocalDate startDate,
                                         LocalDate endDate,
                                         Double budget) {
}
