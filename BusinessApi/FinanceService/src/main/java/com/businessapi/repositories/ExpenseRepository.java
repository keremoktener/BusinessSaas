package com.businessapi.repositories;

import com.businessapi.entity.Expense;
import com.businessapi.entity.enums.EExpenseCategory;
import com.businessapi.entity.enums.EStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByExpenseCategory(EExpenseCategory expenseCategory);
    List<Expense> findByExpenseCategoryAndStatusNot(EExpenseCategory expenseCategory, EStatus status);
    List<Expense> findAllByExpenseDateBetween(LocalDate startDate, LocalDate endDate);
    Page<Expense> findAllByStatusNot(EStatus status, Pageable pageable);
    List<Expense> findAllByMemberIdAndExpenseDateBetweenAndStatusNot(Long memberId, LocalDate startDate, LocalDate endDate, EStatus status);
    Page<Expense> findAllByStatusNotAndExpenseCategoryNot(EStatus status, EExpenseCategory category, Pageable pageable);
    Page<Expense> findAllByMemberIdAndStatusNotAndExpenseCategoryNot(Long memberId, EStatus status, EExpenseCategory category, Pageable pageable);
    List<Expense> findAllByMemberIdAndStatusNot (Long memberId, EStatus status);


}