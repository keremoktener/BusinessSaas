package com.businessapi.analyticsservice.service;

import com.businessapi.analyticsservice.entity.DataSource;
import com.businessapi.analyticsservice.entity.financeService.entity.Expense;
import com.businessapi.analyticsservice.entity.financeService.entity.FinancialReport;
import com.businessapi.analyticsservice.entity.financeService.entity.Invoice;
import com.businessapi.analyticsservice.entity.financeService.entity.Tax;
import com.businessapi.analyticsservice.entity.financeService.enums.EFinancialReportType;
import com.businessapi.analyticsservice.entity.financeService.enums.EInvoiceStatus;
import com.businessapi.analyticsservice.entity.financeService.enums.ETaxType;
import com.businessapi.analyticsservice.repository.DataSourceRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class FinanceService {
    public DataSourceRepository dataSourceRepository;

    public FinanceService(DataSourceRepository dataSourceRepository) {
        this.dataSourceRepository = dataSourceRepository;
    }

    // fetch data from the DataSource by serviceType
    public String getDataFromDataSource(String endpointType) {
        DataSource dataSource = dataSourceRepository.findByEndpointType(endpointType)
                .orElseThrow(() -> new RuntimeException("DataSource not found for service type: " + endpointType));
        return dataSource.getData();
    }

    /*
     * Invoice
     */
    // parse Invoice from JSON string
    public List<Invoice> parseInvoice(String jsonInvoice) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        JsonNode dataNode = objectMapper.readTree(jsonInvoice).get("data");
        return Arrays.asList(objectMapper.treeToValue(dataNode, Invoice[].class));
    }

    // get count of invoices by status
    public Map<EInvoiceStatus, Long> getInvoiceStatusCount(List<Invoice> invoices) {
        return invoices.stream()
                .collect(Collectors.groupingBy(Invoice::getInvoiceStatus, Collectors.counting()));
    }

    /*
     * Tax
     */
    // Parse Tax data from JSON
    public List<Tax> parseTaxes(String jsonTax) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        JsonNode dataNode = objectMapper.readTree(jsonTax).get("data");
        return Arrays.asList(objectMapper.treeToValue(dataNode, Tax[].class));
    }

    // Filter Taxes by taxType
    public List<Tax> getTaxesByType(ETaxType taxType) throws Exception {
        String jsonTax = getDataFromDataSource("tax");
        List<Tax> allTaxes = parseTaxes(jsonTax);

        if (taxType == null) {
            return allTaxes;
        }
        return allTaxes.stream()
                .filter(tax -> tax.getTaxType() == taxType)
                .collect(Collectors.toList());
    }

    /*
     * Financial-Report
     */
    // Parse Financial Reports from JSON
    public List<FinancialReport> parseFinancialReports(String jsonFinancialReport) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        JsonNode dataNode = objectMapper.readTree(jsonFinancialReport).get("data");
        return Arrays.asList(objectMapper.treeToValue(dataNode, FinancialReport[].class));
    }

    // Filter Financial Reports by type and date range
    public List<FinancialReport> getFinancialReports(
            EFinancialReportType financialReportType,
            LocalDate startDate,
            LocalDate endDate,
            Double minIncome,
            Double maxIncome,
            Double minOutcome,
            Double maxOutcome,
            Double minProfit,
            Double maxProfit) throws Exception {

        String jsonFinancialReport = getDataFromDataSource("financial-report");
        List<FinancialReport> allReports = parseFinancialReports(jsonFinancialReport);

        return allReports.stream()
                .filter(report -> (financialReportType == null || report.getFinancialReportType() == financialReportType))
                .filter(report -> (startDate == null || !report.getStartDate().isBefore(startDate.atStartOfDay())))
                .filter(report -> (endDate == null || !report.getEndDate().isAfter(endDate.atTime(LocalTime.MAX))))
                .filter(report -> (minIncome == null || report.getTotalIncome() >= minIncome))
                .filter(report -> (maxIncome == null || report.getTotalIncome() <= maxIncome))
                .filter(report -> (minOutcome == null || report.getTotalOutcome() >= minOutcome))
                .filter(report -> (maxOutcome == null || report.getTotalOutcome() <= maxOutcome))
                .filter(report -> (minProfit == null || report.getTotalProfit() >= minProfit))
                .filter(report -> (maxProfit == null || report.getTotalProfit() <= maxProfit))
                .collect(Collectors.toList());
    }

    /*
     * Expense
     */
    // Parse Financial Reports from JSON
    public List<Expense> parseExpenses(String jsonExpenses) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        JsonNode dataNode = objectMapper.readTree(jsonExpenses).get("data");
        return Arrays.asList(objectMapper.treeToValue(dataNode, Expense[].class));
    }

    // Filter Expenses by date range and amount range
    public List<Expense> getExpenses(
            LocalDate startDate,
            LocalDate endDate,
            Double minAmount,
            Double maxAmount) throws Exception {

        String jsonExpenses = getDataFromDataSource("expense");
        List<Expense> allExpenses = parseExpenses(jsonExpenses);

        return allExpenses.stream()
                .filter(expense -> (startDate == null || !expense.getExpenseDate().isBefore(startDate.atStartOfDay())))
                .filter(expense -> (endDate == null || !expense.getExpenseDate().isAfter(endDate.atTime(LocalTime.MAX))))
                .filter(expense -> (minAmount == null || expense.getAmount() >= minAmount))
                .filter(expense -> (maxAmount == null || expense.getAmount() <= maxAmount))
                .collect(Collectors.toList());
    }
}
