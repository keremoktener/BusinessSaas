package com.businessapi.util;

import com.businessapi.dto.request.*;
import com.businessapi.entity.enums.EBudgetCategory;
import com.businessapi.entity.enums.EExpenseCategory;
import com.businessapi.services.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;

@RequiredArgsConstructor
@Service
public class DemoDataGenerator {
    private final BudgetService budgetService;
    private final ExpenseService expenseService;
    private final IncomeService incomeService;
    private final DepartmentService departmentService;
    private final InvoiceService invoiceService;


    @PostConstruct
    public void generateDemoData() {
        generateDepartmentDemoData();
        generateBudgetDemoData();
        generateIncomeDemoData();
        generateExpenseDemoData();
        generateInvoiceDemoData();
        //setSpentAmounts();
    }

    private void generateDepartmentDemoData() {
        departmentService.saveDepartmentForDemoData(new SaveDepartmentRequestDTO("SALES"));
        departmentService.saveDepartmentForDemoData(new SaveDepartmentRequestDTO("MARKETING"));
        departmentService.saveDepartmentForDemoData(new SaveDepartmentRequestDTO("HR"));
        departmentService.saveDepartmentForDemoData(new SaveDepartmentRequestDTO("IT"));
        departmentService.saveDepartmentForDemoData(new SaveDepartmentRequestDTO("FINANCE"));
        departmentService.saveDepartmentForDemoData(new SaveDepartmentRequestDTO("R&D"));
        departmentService.saveDepartmentForDemoData(new SaveDepartmentRequestDTO("CSR"));
    }

    private void generateBudgetDemoData() {
        budgetService.saveForDemoData(new BudgetSaveRequestDTO(1L, new BigDecimal(200000), EBudgetCategory.OTHER, "Sales budget for 2024"));
        budgetService.saveForDemoData(new BudgetSaveRequestDTO(1L, new BigDecimal(300000), EBudgetCategory.MARKETING, "Marketing budget for 2024"));
        budgetService.saveForDemoData(new BudgetSaveRequestDTO(2L, new BigDecimal(500000), EBudgetCategory.MARKETING, "Marketing budget for 2024"));
        budgetService.saveForDemoData(new BudgetSaveRequestDTO(3L, new BigDecimal(1000000), EBudgetCategory.PERSONNEL, "HR budget for 2024"));
        budgetService.saveForDemoData(new BudgetSaveRequestDTO(4L, new BigDecimal(200000), EBudgetCategory.OFFICE_SUPPLIES, "IT budget for 2024"));
        budgetService.saveForDemoData(new BudgetSaveRequestDTO(5L, new BigDecimal(300000), EBudgetCategory.UTILITIES, "Finance budget for 2024"));
        budgetService.saveForDemoData(new BudgetSaveRequestDTO(5L, new BigDecimal(300000), EBudgetCategory.EDUCATION, "Finance budget for 2024"));
        budgetService.saveForDemoData(new BudgetSaveRequestDTO(6L, new BigDecimal(100000), EBudgetCategory.TRAVEL, "R&D budget for 2024"));
        budgetService.saveForDemoData(new BudgetSaveRequestDTO(7L, new BigDecimal(150000), EBudgetCategory.INSURANCE, "CSR budget for 2024"));
        budgetService.saveForDemoData(new BudgetSaveRequestDTO(7L, new BigDecimal(150000), EBudgetCategory.OTHER, "CSR budget for 2024"));
        }

    private void generateIncomeDemoData() {
        incomeService.saveIncomeForDemoData(new IncomeSaveRequestDTO("Product Sales", new BigDecimal(120000), LocalDate.parse("2024-01-15")));
        incomeService.saveIncomeForDemoData(new IncomeSaveRequestDTO("Service Fees", new BigDecimal(50000), LocalDate.parse("2024-02-15")));
        incomeService.saveIncomeForDemoData(new IncomeSaveRequestDTO("Subscription Fees", new BigDecimal(80000), LocalDate.parse("2024-03-15")));
        incomeService.saveIncomeForDemoData(new IncomeSaveRequestDTO("Licensing Fees", new BigDecimal(30000), LocalDate.parse("2024-04-15")));
        incomeService.saveIncomeForDemoData(new IncomeSaveRequestDTO("Advertising", new BigDecimal(15000), LocalDate.parse("2024-05-15")));
        incomeService.saveIncomeForDemoData(new IncomeSaveRequestDTO("Commission", new BigDecimal(25000), LocalDate.parse("2024-06-15")));
        incomeService.saveIncomeForDemoData(new IncomeSaveRequestDTO("Sponsorship", new BigDecimal(40000), LocalDate.parse("2024-07-15")));
        incomeService.saveIncomeForDemoData(new IncomeSaveRequestDTO("Franchise Fees", new BigDecimal(60000), LocalDate.parse("2024-08-15")));
        incomeService.saveIncomeForDemoData(new IncomeSaveRequestDTO("Interest Income", new BigDecimal(50000), LocalDate.parse("2024-09-15")));
        incomeService.saveIncomeForDemoData(new IncomeSaveRequestDTO("Rental Income", new BigDecimal(10000), LocalDate.parse("2024-10-15")));
        incomeService.saveIncomeForDemoData(new IncomeSaveRequestDTO("Royalties", new BigDecimal(80000), LocalDate.parse("2024-11-15")));
        incomeService.saveIncomeForDemoData(new IncomeSaveRequestDTO("Partnerships/Collaborations", new BigDecimal(20000), LocalDate.parse("2024-12-15")));
    }

    private void generateExpenseDemoData() {
        expenseService.saveForDemoData(new ExpenseSaveRequestDTO(1L, EExpenseCategory.BUSSINESS, LocalDate.parse("2024-01-15"), new BigDecimal(20000), "Monthly rent"));
        expenseService.saveForDemoData(new ExpenseSaveRequestDTO(1L, EExpenseCategory.PERSONNEL, LocalDate.parse("2024-01-15"), new BigDecimal(20000), "Salaries"));
        expenseService.saveForDemoData(new ExpenseSaveRequestDTO(2L, EExpenseCategory.OFFICE_SUPPLIES, LocalDate.parse("2024-02-15"), new BigDecimal(50000), "Marketing materials"));
        expenseService.saveForDemoData(new ExpenseSaveRequestDTO(3L, EExpenseCategory.PERSONNEL, LocalDate.parse("2024-03-15"), new BigDecimal(100000), "Salaries"));
        expenseService.saveForDemoData(new ExpenseSaveRequestDTO(4L, EExpenseCategory.TRAVEL, LocalDate.parse("2024-04-15"), new BigDecimal(20000), "Software licenses"));
        expenseService.saveForDemoData(new ExpenseSaveRequestDTO(5L, EExpenseCategory.UTILITIES, LocalDate.parse("2024-05-15"), new BigDecimal(30000), "Electricity"));
        expenseService.saveForDemoData(new ExpenseSaveRequestDTO(5L, EExpenseCategory.UTILITIES, LocalDate.parse("2024-06-15"), new BigDecimal(30000), "Water"));
        expenseService.saveForDemoData(new ExpenseSaveRequestDTO(6L, EExpenseCategory.EDUCATION, LocalDate.parse("2024-06-15"), new BigDecimal(10000), "Training"));
        expenseService.saveForDemoData(new ExpenseSaveRequestDTO(7L, EExpenseCategory.OTHER, LocalDate.parse("2024-07-15"), new BigDecimal(15000), "Donation"));
    }

    private void generateInvoiceDemoData() {
        invoiceService.saveForDemoData(new InvoiceSaveRequestDTO("12345678901", "ali.kaya@gmail.com", "05321234567", 101L, "Laptop", 1, LocalDate.parse("2024-01-15"), new BigDecimal(15000)));
        invoiceService.saveForDemoData(new InvoiceSaveRequestDTO("23456789012", "ayse.yilmaz@gmail.com", "05337654321", 102L, "Smartphone", 2, LocalDate.parse("2024-02-20"), new BigDecimal(20000)));
        invoiceService.saveForDemoData(new InvoiceSaveRequestDTO("34567890123", "mehmet.demir@gmail.com", "05339876543", 103L, "Tablet", 1, LocalDate.parse("2024-03-25"), new BigDecimal(7000)));
        invoiceService.saveForDemoData(new InvoiceSaveRequestDTO("45678901234", "fatma.celik@gmail.com", "05340987654", 104L, "Headphones", 3, LocalDate.parse("2024-04-10"), new BigDecimal(1500)));
        invoiceService.saveForDemoData(new InvoiceSaveRequestDTO("56789012345", "hasan.ozcan@gmail.com", "05341234598", 105L, "Smart Watch", 2, LocalDate.parse("2024-05-05"), new BigDecimal(6000)));
        invoiceService.saveForDemoData(new InvoiceSaveRequestDTO("67890123456", "zeynep.aksoy@gmail.com", "05342345678", 106L, "Gaming Console", 1, LocalDate.parse("2024-06-15"), new BigDecimal(30000)));
        invoiceService.saveForDemoData(new InvoiceSaveRequestDTO("78901234567", "mustafa.kurt@gmail.com", "05343456789", 107L, "Camera", 1, LocalDate.parse("2024-07-20"), new BigDecimal(12000)));
        invoiceService.saveForDemoData(new InvoiceSaveRequestDTO("89012345678", "elif.arslan@gmail.com", "05344567890", 108L, "Printer", 2, LocalDate.parse("2024-08-25"), new BigDecimal(4500)));
        invoiceService.saveForDemoData(new InvoiceSaveRequestDTO("90123456789", "burak.duman@gmail.com", "05345678901", 109L, "Monitor", 1, LocalDate.parse("2024-09-15"), new BigDecimal(5500)));
        invoiceService.saveForDemoData(new InvoiceSaveRequestDTO("01234567890", "emine.ustun@gmail.com", "05346789012", 110L, "Keyboard", 3, LocalDate.parse("2024-10-05"), new BigDecimal(750)));
    }

//    private void setSpentAmounts() {
//        budgetService.setSpentAmount("SALES", new BigDecimal(20000));
//        budgetService.setSpentAmount("MARKETING", new BigDecimal(505000));
//        budgetService.setSpentAmount("HR", new BigDecimal(100000));
//        budgetService.setSpentAmount("IT", new BigDecimal(20000));
//        budgetService.setSpentAmount("FINANCE", new BigDecimal(30000));
//        budgetService.setSpentAmount("R&D", new BigDecimal(10000));
//        budgetService.setSpentAmount("CSR", new BigDecimal(15000));
//    }
}
