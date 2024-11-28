package com.businessapi.repositories;

import com.businessapi.entity.Budget;
import com.businessapi.entity.Income;
import com.businessapi.entity.enums.EStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface IncomeRepository extends JpaRepository<Income, Long> {
    List<Income> findAllByIncomeDateBetween(LocalDate startDate, LocalDate endDate);

    @Query("SELECT i FROM Income i WHERE i.source LIKE %:source% AND i.status != :status")
    Page<Income> findBySourceContainingIgnoreCaseAndStatusNot(@Param("source") String department, @Param("status") EStatus status, Pageable pageable);

    Page<Income> findAllByStatusNot(EStatus status, Pageable pageable);

    List<Income> findAllByIncomeDateBetweenAndStatusNot(LocalDate startDate, LocalDate endDate, EStatus status);

    List<Income> findAllByIncomeDateBetweenAndMemberId(LocalDate startDate, LocalDate endDate, Long memberId);

    Page<Income> findAllByMemberIdAndSourceContainingIgnoreCaseAndStatusNot (Long memberId, String source, EStatus status, Pageable pageable);

    Page<Income> findAllByMemberIdAndStatusNot (Long memberId, EStatus status, Pageable pageable);
}
