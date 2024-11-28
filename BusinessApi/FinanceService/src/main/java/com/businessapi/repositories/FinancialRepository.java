package com.businessapi.repositories;

import com.businessapi.entity.FinancialReport;
import com.businessapi.entity.enums.EStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FinancialRepository extends JpaRepository<FinancialReport, Long> {
    Page<FinancialReport> findAllByStatusNot(EStatus status, Pageable pageable);

}

