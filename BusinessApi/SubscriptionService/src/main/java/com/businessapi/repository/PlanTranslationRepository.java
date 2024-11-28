package com.businessapi.repository;

import com.businessapi.entity.PlanTranslation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanTranslationRepository extends JpaRepository<PlanTranslation, Long> {
}
