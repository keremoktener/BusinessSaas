package com.businessapi.services;

import com.businessapi.dto.request.BudgetSaveRequestDTO;
import com.businessapi.dto.request.BudgetUpdateRequestDTO;
import com.businessapi.dto.request.PageRequestDTO;
import com.businessapi.dto.response.*;
import com.businessapi.entity.Budget;
import com.businessapi.entity.Department;
import com.businessapi.entity.Expense;
import com.businessapi.entity.enums.EBudgetCategory;
import com.businessapi.entity.enums.EStatus;
import com.businessapi.exception.ErrorType;
import com.businessapi.exception.FinanceServiceException;
import com.businessapi.repositories.BudgetRepository;
import com.businessapi.util.SessionManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class BudgetService {
    private final BudgetRepository budgetRepository;
    private final DepartmentService departmentService;

    @Transactional
    public Boolean save(BudgetSaveRequestDTO dto) {
        Department department = departmentService.getDepartmentById(dto.departmentId());
        department.getBudgets().size();
        Budget budget = Budget.builder()
                .department(department)
                .subAmount(dto.subAmount())
                .budgetCategory(dto.budgetCategory())
                .description(dto.description())
                .memberId(SessionManager.getMemberIdFromAuthenticatedMember())
                .build();

        department.getBudgets().add(budget);
        budget.setTotalAmount(budget.getTotalAmount().add(budget.getSubAmount()));
        budgetRepository.save(budget);
        return true;
    }

    @Transactional
    public Boolean saveForDemoData(BudgetSaveRequestDTO dto) {
        Department department = departmentService.getDepartmentById(dto.departmentId());
        department.getBudgets().size();
        Budget budget = Budget.builder()
                .department(department)
                .subAmount(dto.subAmount())
                .budgetCategory(dto.budgetCategory())
                .description(dto.description())
                .memberId(2L)
                .build();

        department.getBudgets().add(budget);
        budgetRepository.save(budget);
        return true;
    }

    public Boolean update(BudgetUpdateRequestDTO dto) {
        Department department = departmentService.getDepartmentById(dto.departmentId());
        Budget budget = budgetRepository.findById(dto.id()).orElseThrow(() -> new FinanceServiceException(ErrorType.BUDGET_NOT_FOUND));
        budget.setDepartment(department);
        budget.setSubAmount(dto.subAmount());
        budget.setBudgetCategory(dto.budgetCategory());
        budget.setDescription(dto.description());

        budget.setTotalAmount(budget.getTotalAmount().add(budget.getSubAmount()));
        budgetRepository.save(budget);
        return true;
    }

    public Boolean delete(Long id) {
        Budget budget = budgetRepository.findById(id).orElseThrow(() -> new FinanceServiceException(ErrorType.BUDGET_NOT_FOUND));
        budget.setStatus(EStatus.DELETED);

        budgetRepository.save(budget);

        return true;
    }

    public List<BudgetMergedByDepartmentResponseDTO> findAll(PageRequestDTO dto) {
        Long memberId = SessionManager.getMemberIdFromAuthenticatedMember();
        List<Department> departmentList = departmentService.findAllByMemberId(memberId);
        List<BudgetMergedByDepartmentResponseDTO> budgetMergedByDepartmentResponseDTOS = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;
        BigDecimal spentAmount = BigDecimal.ZERO;
        for (Department department : departmentList) {
            List<Budget> budgets = department.getBudgets();
            List<Expense> expenses = department.getExpenses();
            for (Budget budget : budgets) {
                if (budget.getStatus().equals(EStatus.ACTIVE)) {
                    totalAmount = totalAmount.add(budget.getSubAmount());
                }
            }
            for (Expense expense : expenses) {
                if (expense.getDepartment().equals(department) && !expense.getStatus().equals(EStatus.DELETED)) {
                    spentAmount = spentAmount.add(expense.getAmount());
                }
            }
            budgetMergedByDepartmentResponseDTOS.add(new BudgetMergedByDepartmentResponseDTO(department.getId(), totalAmount, spentAmount, department.getName()));
            totalAmount = BigDecimal.ZERO;
            spentAmount = BigDecimal.ZERO;
        }
        return budgetMergedByDepartmentResponseDTOS;
    }


    public Budget findById(Long id) {
        return budgetRepository.findById(id).orElseThrow(() -> new FinanceServiceException(ErrorType.BUDGET_NOT_FOUND));
    }

    public List<BudgetCategoryResponseDTO> getAllCategories() {
        List<EBudgetCategory> categories = new ArrayList<>(Arrays.asList(EBudgetCategory.values()));
        List<BudgetCategoryResponseDTO> categoryResponseDTOS = new ArrayList<>();
        for (long l = 0; l < categories.size(); l++) {
            categoryResponseDTOS.add(new BudgetCategoryResponseDTO(l, categories.get((int) l).name()));
        }
        return categoryResponseDTOS;
    }

    public List<BudgetByDepartmentResponseDTO> findAllByDepartmentName (String departmentName) {
        Long memberId = SessionManager.getMemberIdFromAuthenticatedMember();
        Department department = departmentService.getDepartmentByNameAndMemberId(departmentName, memberId);
        if (department == null) {
            throw new FinanceServiceException(ErrorType.DEPARTMENT_NOT_FOUND);
        }
        List<Budget> allBudgetsByDepartment = budgetRepository.findAllByDepartmentAndMemberId(department, memberId);
        allBudgetsByDepartment.removeIf(budget -> budget.getStatus().equals(EStatus.DELETED));
        List<BudgetByDepartmentResponseDTO> budgetByDepartmentResponseDTOS = new ArrayList<>();
        for (Budget budget : allBudgetsByDepartment) {
            budgetByDepartmentResponseDTOS.add(new BudgetByDepartmentResponseDTO(budget.getId(), budget.getBudgetCategory(), budget.getSubAmount(), budget.getDescription()));
        }
        return budgetByDepartmentResponseDTOS;
    }



}
