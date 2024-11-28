package com.businessapi.controllers;

import static com.businessapi.constants.Endpoints.*;

import com.businessapi.dto.request.CalculateTaxRequestDto;
import com.businessapi.dto.request.PageRequestDTO;
import com.businessapi.dto.request.TaxSaveRequestDTO;
import com.businessapi.dto.request.TaxUpdateRequestDTO;
import com.businessapi.dto.response.ResponseDTO;
import com.businessapi.entity.Tax;
import com.businessapi.services.TaxService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(ROOT + TAX)
@CrossOrigin("*")
public class TaxController {
    private final TaxService taxService;

    @PostMapping(SAVE)
    @Operation(summary = "Saves new tax")
    @PreAuthorize("hasAnyAuthority('FAM')")
    public ResponseEntity<ResponseDTO<Boolean>> save(@RequestBody TaxSaveRequestDTO dto) {
        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(taxService.save(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @PutMapping(UPDATE)
    @Operation(summary = "Updates an existing tax")
    @PreAuthorize("hasAnyAuthority('FAM')")
    public ResponseEntity<ResponseDTO<Boolean>> update(@RequestBody TaxUpdateRequestDTO dto) {
        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(taxService.update(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @DeleteMapping(DELETE)
    @Operation(summary = "Deletes an existing tax")
    @PreAuthorize("hasAnyAuthority('FAM')")
    public ResponseEntity<ResponseDTO<Boolean>> delete(Long id) {
        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(taxService.delete(id))
                .message("Success")
                .code(200)
                .build());
    }

    @PostMapping(FIND_ALL)
    @Operation(summary = "Lists all the taxes with respect to the given page and size")
    @PreAuthorize("hasAnyAuthority('FAM')")
    public ResponseEntity<ResponseDTO<List<Tax>>> findAll(@RequestBody PageRequestDTO dto) {
        return ResponseEntity.ok(ResponseDTO
                .<List<Tax>>builder()
                .data(taxService.findAll(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @PostMapping(FIND_BY_ID)
    @Operation(summary = "Finds a tax by its id")
    @PreAuthorize("hasAnyAuthority('FAM')")
    public ResponseEntity<ResponseDTO<Tax>> findById(Long id) {
        return ResponseEntity.ok(ResponseDTO
                .<Tax>builder()
                .data(taxService.findById(id))
                .message("Success")
                .code(200)
                .build());
    }

    @PostMapping(CALCULATE)
    @Operation(summary = "Calculates the tax amount with respect to the given tax id and amount")
    @PreAuthorize("hasAnyAuthority('FAM')")
    public ResponseEntity<ResponseDTO<Boolean>> calculateTax(@RequestBody CalculateTaxRequestDto dto) {
        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(taxService.calculateTax(dto))
                .message("Success")
                .code(200)
                .build());
    }
}



