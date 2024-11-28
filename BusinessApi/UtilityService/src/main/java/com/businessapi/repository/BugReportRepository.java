package com.businessapi.repository;

import com.businessapi.entities.BugReport;
import com.businessapi.entities.enums.EStatus;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BugReportRepository extends JpaRepository<BugReport, Long>
{
    List<BugReport> findAllByDescriptionContainingIgnoreCaseAndStatusIsNotOrderByDescriptionAsc(String s, EStatus eStatus, PageRequest of);
}
