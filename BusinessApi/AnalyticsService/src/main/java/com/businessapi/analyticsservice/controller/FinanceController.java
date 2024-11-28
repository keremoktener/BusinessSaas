package com.businessapi.analyticsservice.controller;

import com.businessapi.analyticsservice.dto.response.ResponseDTO;
import com.businessapi.analyticsservice.entity.financeService.entity.Expense;
import com.businessapi.analyticsservice.entity.financeService.entity.FinancialReport;
import com.businessapi.analyticsservice.entity.financeService.entity.Invoice;
import com.businessapi.analyticsservice.entity.financeService.entity.Tax;
import com.businessapi.analyticsservice.entity.financeService.enums.EFinancialReportType;
import com.businessapi.analyticsservice.entity.financeService.enums.EInvoiceStatus;
import com.businessapi.analyticsservice.entity.financeService.enums.ETaxType;
import com.businessapi.analyticsservice.service.FinanceService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/dev/v1/analytics/finances")
public class FinanceController {

    private final FinanceService financeService;

    public FinanceController(FinanceService financeService) {
        this.financeService = financeService;
    }

    @GetMapping("/status-count")
    @Operation(summary = "Get invoice status count")
    public ResponseEntity<ResponseDTO<Map<EInvoiceStatus, Long>>> getInvoiceStatusCount() throws Exception {
        String jsonInvoice = financeService.getDataFromDataSource("invoice");
        List<Invoice> invoice = financeService.parseInvoice(jsonInvoice);
        Map<EInvoiceStatus, Long> statusCount = financeService.getInvoiceStatusCount(invoice);
        return ResponseEntity.ok(
                ResponseDTO.<Map<EInvoiceStatus, Long>>builder()
                        .data(statusCount)
                        .message("Invoice status count fetched successfully")
                        .code(200)
                        .build()
        );
    }

    @GetMapping("/tax-filter")
    @Operation(summary = "Get tax by type")
    public ResponseEntity<ResponseDTO<List<Tax>>> getTaxByType(@RequestParam(required = false) ETaxType taxType) throws Exception {
        List<Tax> filteredTaxes = financeService.getTaxesByType(taxType);
        return ResponseEntity.ok(
                ResponseDTO.<List<Tax>>builder()
                        .data(filteredTaxes)
                        .message("Taxes filtered successfully")
                        .code(200)
                        .build()
        );
    }

    @GetMapping("/financial-report")
    @Operation(summary = "Get financial report")
    public ResponseEntity<ResponseDTO<List<FinancialReport>>> getFinancialReports(
            @RequestParam(required = false) EFinancialReportType financialReportType,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(required = false) Double minIncome,
            @RequestParam(required = false) Double maxIncome,
            @RequestParam(required = false) Double minOutcome,
            @RequestParam(required = false) Double maxOutcome,
            @RequestParam(required = false) Double minProfit,
            @RequestParam(required = false) Double maxProfit) throws Exception {

        List<FinancialReport> filteredReports = financeService.getFinancialReports(
                financialReportType, startDate, endDate, minIncome, maxIncome, minOutcome, maxOutcome, minProfit, maxProfit);
        return ResponseEntity.ok(
                ResponseDTO.<List<FinancialReport>>builder()
                        .data(filteredReports)
                        .message("Financial reports fetched successfully")
                        .code(200)
                        .build()
        );
    }

    @GetMapping("/expense")
    @Operation(summary = "Get expenses")
    public ResponseEntity<ResponseDTO<List<Expense>>> getExpenses(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(required = false) Double minAmount,
            @RequestParam(required = false) Double maxAmount) throws Exception {

        List<Expense> filteredExpenses = financeService.getExpenses(startDate, endDate, minAmount, maxAmount);
        return ResponseEntity.ok(
                ResponseDTO.<List<Expense>>builder()
                        .data(filteredExpenses)
                        .message("Expenses fetched successfully")
                        .code(200)
                        .build()
        );
    }
}
