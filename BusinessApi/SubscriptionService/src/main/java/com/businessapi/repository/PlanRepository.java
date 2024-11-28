package com.businessapi.repository;

import com.businessapi.entity.Plan;
import com.businessapi.entity.enums.EStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlanRepository extends JpaRepository<Plan, Long> {
    List<Plan> findAllByStatus(EStatus status);
    List<Plan> findAllByStatusNot(EStatus status);

}
