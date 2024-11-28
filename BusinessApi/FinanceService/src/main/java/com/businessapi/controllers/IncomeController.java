package com.businessapi.controllers;

import com.businessapi.dto.request.IncomeFindByDateRequestDTO;
import com.businessapi.dto.request.IncomeSaveRequestDTO;
import com.businessapi.dto.request.IncomeUpdateRequestDTO;
import com.businessapi.dto.request.PageRequestDTO;
import com.businessapi.dto.response.ResponseDTO;
import com.businessapi.entity.Income;
import com.businessapi.services.IncomeService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static com.businessapi.constants.Endpoints.*;

@RestController
@RequestMapping(ROOT + INCOME)
@RequiredArgsConstructor
@CrossOrigin("*")
public class IncomeController {
    private final IncomeService incomeService;

    @PostMapping(SAVE)
    @Operation(summary = "Creates new income")
    @PreAuthorize("hasAnyAuthority('FAM')")
    public ResponseEntity<ResponseDTO<Boolean>> save(@RequestBody IncomeSaveRequestDTO dto) {
        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(incomeService.saveIncome(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @PutMapping(UPDATE)
    @Operation(summary = "Updates an existing income")
    @PreAuthorize("hasAnyAuthority('FAM')")
    public ResponseEntity<ResponseDTO<Boolean>> update(@RequestBody IncomeUpdateRequestDTO dto) {
        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(incomeService.updateIncome(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @DeleteMapping(DELETE)
    @Operation(summary = "Deletes an existing income")
    @PreAuthorize("hasAnyAuthority('FAM')")
    public ResponseEntity<ResponseDTO<Boolean>> delete(Long id) {
        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(incomeService.deleteIncome(id))
                .message("Success")
                .code(200)
                .build());
    }

    @PostMapping(FIND_BY_DATE)
    @Operation(summary = "Lists all incomes with between the given dates")
    @PreAuthorize("hasAnyAuthority('FAM')")
    public ResponseEntity<ResponseDTO<List<Income>>> findByDate(@RequestBody IncomeFindByDateRequestDTO dto) {
        return ResponseEntity.ok(ResponseDTO
                .<List<Income>>builder()
                .data(incomeService.findByDate(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @PostMapping(FIND_BY_ID)
    @Operation(summary = "Finds an income by its id")
    @PreAuthorize("hasAnyAuthority('FAM')")
    public ResponseEntity<ResponseDTO<Income>> findById(Long id) {
        return ResponseEntity.ok(ResponseDTO
                .<Income>builder()
                .data(incomeService.findById(id))
                .message("Success")
                .code(200)
                .build());
    }

    @PostMapping(FIND_ALL)
    @Operation(summary = "Lists all incomes")
    @PreAuthorize("hasAnyAuthority('FAM')")
    public ResponseEntity<ResponseDTO<List<Income>>> findAll(@RequestBody PageRequestDTO dto) {
        return ResponseEntity.ok(ResponseDTO
                .<List<Income>>builder()
                .data(incomeService.findAll(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @PostMapping(CALCULATE)
    @Operation(summary = "Calculates the income between the given dates")
    @PreAuthorize("hasAnyAuthority('FAM')")
    public ResponseEntity<ResponseDTO<BigDecimal>> calculateIncome(@RequestBody IncomeFindByDateRequestDTO dto) {
        return ResponseEntity.ok(ResponseDTO
                .<BigDecimal>builder()
                .data(incomeService.calculateTotalIncomeBetweenDates(dto.startDate(), dto.endDate()))
                .message("Success")
                .code(200)
                .build());
    }

    @PostMapping(GET_FOR_MONTHS)
    @Operation(summary = "Lists all incomes for the given months")
    @PreAuthorize("hasAnyAuthority('FAM')")
    public ResponseEntity<ResponseDTO<List<BigDecimal>>> getForMonths(@RequestBody IncomeFindByDateRequestDTO dto) {
        return ResponseEntity.ok(ResponseDTO
                .<List<BigDecimal>>builder()
                .data(incomeService.getForMonths(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @PostMapping(GET_MOST)
    @Operation(summary = "Lists the most 5 income source")
    @PreAuthorize("hasAnyAuthority('FAM')")
    public ResponseEntity<ResponseDTO<List<String>>> getMostSource(@RequestBody IncomeFindByDateRequestDTO dto) {
        return ResponseEntity.ok(ResponseDTO
                .<List<String>>builder()
                .data(incomeService.getMostSource(dto))
                .message("Success")
                .code(200)
                .build());
    }

}
