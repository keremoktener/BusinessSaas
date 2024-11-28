package com.businessapi.analyticsservice.service;

import com.businessapi.analyticsservice.entity.DataSource;
import com.businessapi.analyticsservice.entity.hrmService.entity.Benefit;
import com.businessapi.analyticsservice.entity.hrmService.entity.Performance;
import com.businessapi.analyticsservice.repository.DataSourceRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class HRMService {
    private final DataSourceRepository dataSourceRepository;

    public HRMService(DataSourceRepository dataSourceRepository) {
        this.dataSourceRepository = dataSourceRepository;
    }

    // fetch data from the DataSource by serviceType
    public String getDataFromDataSource(String endpointType) {
        DataSource dataSource = dataSourceRepository.findByEndpointType(endpointType)
                .orElseThrow(() -> new RuntimeException("DataSource not found for service type: " + endpointType));
        return dataSource.getData();
    }

    /*
     * Performance
     */
    // Parse performance from JSON string
    public List<Performance> parsePerformance(String jsonPerformance) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        JsonNode dataNode = objectMapper.readTree(jsonPerformance).get("data");
        return Arrays.asList(objectMapper.treeToValue(dataNode, Performance[].class));
    }

    // Analyze total performance between given dates
    public List<Performance> analyzeTotalPerformance(String startDateStr, String endDateStr) throws Exception {
        LocalDate startDate = LocalDate.parse(startDateStr);
        LocalDate endDate = LocalDate.parse(endDateStr);

        String jsonPerformance = getDataFromDataSource("performance");
        List<Performance> performanceList = parsePerformance(jsonPerformance);
        System.out.println(performanceList);
        return performanceList.stream()
                .filter(performance -> !performance.getDate().isBefore(startDate) && !performance.getDate().isAfter(endDate))
                .collect(Collectors.toList());
    }

    /*
     * Benefit
     */
    // Parse benefits from JSON string
    public List<Benefit> parseBenefits(String jsonBenefits) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        JsonNode dataNode = objectMapper.readTree(jsonBenefits).get("data");
        return Arrays.asList(objectMapper.treeToValue(dataNode, Benefit[].class));
    }

    // Calculate total benefits per employee between given dates
    public Map<Long, BigDecimal> calculateTotalBenefits(LocalDate startDate, LocalDate endDate) throws Exception {
        String jsonBenefits = getDataFromDataSource("benefit");
        List<Benefit> benefitList = parseBenefits(jsonBenefits);

        return benefitList.stream()
                .filter(benefit -> !benefit.getStartDate().isBefore(startDate) && !benefit.getEndDate().isAfter(endDate))
                .collect(Collectors.groupingBy(
                        Benefit::getEmployeeId,
                        Collectors.mapping(Benefit::getAmount, Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))
                ));
    }
}
