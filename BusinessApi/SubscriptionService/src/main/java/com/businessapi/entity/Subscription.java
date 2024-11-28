package com.businessapi.entity;

import com.businessapi.dto.request.SubscriptionHistoryRequestDto;
import com.businessapi.entity.enums.ESubscriptionType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@EqualsAndHashCode(callSuper = true)
@Data
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tblsubscriptions")
public class Subscription extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    private Long authId;
    @ManyToOne
    private Plan plan;
    private ESubscriptionType subscriptionType;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    @Builder.Default
    private LocalDateTime cancellationDate = null;

    public SubscriptionHistoryRequestDto toSubscriptionHistoryRequestDto(String language) {
        return SubscriptionHistoryRequestDto
                .builder()
                .authId(authId)
                .planName(plan.getPlanTranslationByLanguage(language).getName())
                .planDescription(plan.getPlanTranslationByLanguage(language).getDescription())
                .subscriptionType(subscriptionType)
                .cancellationDate(cancellationDate)
                .status(super.getStatus())
                .startDate(startDate)
                .endDate(endDate)
                .planPrice(plan.getPrice())
                .build();
    }
}
