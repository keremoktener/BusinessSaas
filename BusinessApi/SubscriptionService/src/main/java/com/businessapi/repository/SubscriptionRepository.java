package com.businessapi.repository;

import com.businessapi.entity.Subscription;
import com.businessapi.entity.enums.EStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    List<Subscription> findAllByAuthIdAndStatusNot(Long authId, EStatus status);

    Optional<Subscription> findByPlanIdAndAuthIdAndStatus (Long planId, Long authId, EStatus status);

    List<Subscription> findAllByAuthIdAndStatus(Long authId, EStatus status);

    List<Subscription> findAllByAuthId(Long authId);

    List<Subscription> findByEndDateBetween(LocalDateTime startOfDay, LocalDateTime endOfDay);

}
