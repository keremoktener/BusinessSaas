package com.businessapi.dto.response;

public record FeedbackReportDTO(
        Long totalFeedbacks,
        Double averageRating
)  {
}
