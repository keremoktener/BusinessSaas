package com.businessapi.services;

import com.businessapi.dto.request.FinancialReportSaveRequestDTO;
import com.businessapi.dto.request.FinancialReportUpdateRequestDTO;
import com.businessapi.dto.request.PageRequestDTO;
import com.businessapi.dto.response.ExpenseResponseDTO;
import com.businessapi.entity.Expense;
import com.businessapi.entity.FinancialReport;
import com.businessapi.entity.enums.EExpenseCategory;
import com.businessapi.entity.enums.EFinancialReportType;
import com.businessapi.entity.enums.EStatus;
import com.businessapi.exception.ErrorType;
import com.businessapi.exception.FinanceServiceException;
import com.businessapi.repositories.FinancialRepository;
import com.businessapi.util.SessionManager;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FinancialReportService {
    private final FinancialRepository financialRepository;
    private final IncomeService incomeService;
    private final ExpenseService expenseService;

    public Boolean save(FinancialReportSaveRequestDTO dto) {
        BigDecimal totalIncome = incomeService.calculateTotalIncomeBetweenDates(dto.startDate(), dto.endDate());
        BigDecimal totalOutcome = expenseService.calculateTotalExpenseBetweenDates(dto.startDate(), dto.endDate());
        List<ExpenseResponseDTO> expenseList = expenseService.findByDate(dto.startDate(), dto.endDate());
        BigDecimal taxPaid = BigDecimal.ZERO;
        for (ExpenseResponseDTO expense : expenseList) {
            if (expense.expenseCategory().equals(EExpenseCategory.TAX)) {
                taxPaid = taxPaid.add(expense.amount());
            }
        }
        String message = createMessage(totalIncome, totalOutcome, taxPaid);
        FinancialReport financialReport = FinancialReport.builder()
                .financialReportType(dto.financialReportType())
                .startDate(dto.startDate())
                .endDate(dto.endDate())
                .totalIncome(totalIncome)
                .totalOutcome(totalOutcome)
                .totalTax(taxPaid)
                .totalProfit(totalIncome.subtract(totalOutcome))
                .message(message)
                .memberId(SessionManager.getMemberIdFromAuthenticatedMember())
                .build();

        financialRepository.save(financialReport);
        return true;
    }

    private static String createMessage(BigDecimal totalIncome, BigDecimal totalOutcome, BigDecimal taxPaid) {
        String message;
        if (totalIncome.compareTo(totalOutcome) < 0) {
            message = "Toplam gider: " + totalOutcome + " Ödenen vergi: " + taxPaid + " Toplam gelir: " + totalIncome + " Toplam zarar: " + totalOutcome.subtract(totalIncome)
                    + " Şirket bu dönemde zararda!";
        } else {
            message = "Toplam gelir: " + totalIncome + " Ödenen vergi: " + taxPaid + " Toplam gider: " + totalOutcome + " Toplam kar: " + totalIncome.subtract(totalOutcome)
                    + " Şirket bu dönemde karda!";
        }
        return message;
    }

    public Boolean update(FinancialReportUpdateRequestDTO dto) {
        FinancialReport financialReport = financialRepository.findById(dto.id()).orElseThrow(() -> new FinanceServiceException(ErrorType.FINANCIAL_REPORT_NOT_FOUND));
        financialReport.setFinancialReportType(dto.financialReportType());
        financialReport.setStartDate(dto.startDate());
        financialReport.setEndDate(dto.endDate());
        financialReport.setTotalIncome(dto.totalIncome());
        financialReport.setTotalOutcome(dto.totalOutcome());
        financialReport.setTotalProfit(dto.totalProfit());

        financialRepository.save(financialReport);
        return true;
    }

    public Boolean delete(Long id) {
        FinancialReport financialReport = financialRepository.findById(id).orElseThrow(() -> new FinanceServiceException(ErrorType.FINANCIAL_REPORT_NOT_FOUND));
        financialReport.setStatus(EStatus.DELETED);
        financialRepository.save(financialReport);
        return true;
    }

    public List<FinancialReport> findAll(PageRequestDTO dto) {
        Long memberId = SessionManager.getMemberIdFromAuthenticatedMember();
        List<FinancialReport> financialReports = financialRepository.findAllByStatusNot(EStatus.DELETED, PageRequest.of(dto.page(), dto.size())).getContent();
        financialReports.removeIf(financialReport -> !financialReport.getMemberId().equals(memberId));
        return financialReports;
    }

    public FinancialReport findById(Long id) {
        return financialRepository.findById(id).orElseThrow(() -> new FinanceServiceException(ErrorType.FINANCIAL_REPORT_NOT_FOUND));
    }

    public FinancialReport compare(List<Long> ids) {
        List<FinancialReport> financialReports = financialRepository.findAllById(ids);
        BigDecimal totalIncome = BigDecimal.ZERO;
        BigDecimal totalOutcome = BigDecimal.ZERO;
        BigDecimal totalTax = BigDecimal.ZERO;
        BigDecimal totalProfit = BigDecimal.ZERO;
        for (FinancialReport financialReport : financialReports) {
            totalIncome = totalIncome.add(financialReport.getTotalIncome());
            totalOutcome = totalOutcome.add(financialReport.getTotalOutcome());
            totalTax = totalTax.add(financialReport.getTotalTax());
            totalProfit = totalProfit.add(financialReport.getTotalProfit());
        }
        String message = createMessageForComparingReports(totalIncome, totalOutcome, totalTax);
        return FinancialReport.builder()
                .financialReportType(EFinancialReportType.KARSILASTIRMA)
                .startDate(financialReports.getFirst().getStartDate())
                .endDate(financialReports.getLast().getEndDate())
                .totalIncome(totalIncome)
                .totalOutcome(totalOutcome)
                .totalTax(totalTax)
                .totalProfit(totalProfit)
                .message(message)
                .build();
    }

    private String createMessageForComparingReports(BigDecimal totalIncome, BigDecimal totalOutcome, BigDecimal totalTax) {
        String message;
        if (totalIncome.compareTo(totalOutcome) < 0) {
            message = "Bu dönemler içersinde şirket zarardadır, Toplam gider: " + totalOutcome + " Ödenen vergi: " + totalTax + " Toplam gelir: " + totalIncome + " Toplam zarar: " + totalOutcome.subtract(totalIncome);
        } else {
            message = "Bu dönemler içersinde şirket kardadır, Toplam gelir: " + totalIncome + " Ödenen vergi: " + totalTax + " Toplam gider: " + totalOutcome + " Toplam kar: " + totalIncome.subtract(totalOutcome);
        }
        return message;
    }
}

