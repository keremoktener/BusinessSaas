package com.businessapi.dto.request;

import java.time.LocalDate;


public record MarketingCampaignSaveDTO(String name,
                                       String description,
                                       LocalDate startDate,
                                       LocalDate endDate,
                                       Double budget
                                       ) {
}
