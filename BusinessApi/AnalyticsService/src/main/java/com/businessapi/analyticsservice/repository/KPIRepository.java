package com.businessapi.analyticsservice.repository;

import com.businessapi.analyticsservice.entity.KPI;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KPIRepository extends JpaRepository<KPI, Long> {
}
