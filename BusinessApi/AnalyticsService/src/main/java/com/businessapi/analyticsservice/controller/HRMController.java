package com.businessapi.analyticsservice.controller;

import com.businessapi.analyticsservice.dto.response.ResponseDTO;
import com.businessapi.analyticsservice.entity.hrmService.entity.Performance;
import com.businessapi.analyticsservice.service.HRMService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/dev/v1/analytics/hrm")
public class HRMController {
    private final HRMService hrmService;

    public HRMController(HRMService hrmService) {
        this.hrmService = hrmService;
    }

    /*
    * Performance
     */
    @GetMapping("/performance")
    @Operation(summary = "Get total performance")
    public ResponseEntity<ResponseDTO<List<Performance>>> getFilteredPerformance(
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate) throws Exception {

        List<Performance> totalPerformance = hrmService.analyzeTotalPerformance(startDate, endDate);

        return ResponseEntity.ok(ResponseDTO.<List<Performance>>builder()
                .data(totalPerformance)
                .message("Success")
                .code(200)
                .build());
    }

    /*
     * Benefit
     */
    @GetMapping("/total-benefits")
    @Operation(summary = "Get total benefits")
    public ResponseEntity<ResponseDTO<Map<Long, BigDecimal>>> getTotalBenefits(
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate) throws Exception {

        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);

        Map<Long, BigDecimal> totalBenefits = hrmService.calculateTotalBenefits(start, end);

        return ResponseEntity.ok(ResponseDTO.<Map<Long, BigDecimal>>builder()
                .data(totalBenefits)
                .message("Success")
                .code(200)
                .build());
    }

}
