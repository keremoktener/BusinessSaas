package com.businessapi.controller;

import com.businessapi.dto.request.PageRequestDTO;
import com.businessapi.dto.request.SalesActivitySaveDTO;
import com.businessapi.dto.request.SalesActivityUpdateDTO;
import com.businessapi.dto.response.ResponseDTO;
import com.businessapi.entity.SalesActivity;
import com.businessapi.service.SalesActivityService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.businessapi.constants.EndPoints.*;

@RestController
@RequestMapping(SALESACTIVITY)
@RequiredArgsConstructor
@CrossOrigin("*")
public class SalesActivityController {
    private final SalesActivityService salesActivityService;

    @PostMapping(SAVE)
    @Operation(summary = "Saves new sales activity")
    public ResponseEntity<ResponseDTO<Boolean>> save(@RequestBody SalesActivitySaveDTO dto) {

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(salesActivityService.save(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @PostMapping(FINDALL)
    @Operation(summary = "Find all sales activities")
    public ResponseEntity<ResponseDTO<List<SalesActivity>>> findAll(@RequestBody PageRequestDTO dto) {
        return ResponseEntity.ok(ResponseDTO
                .<List<SalesActivity>>builder()
                .data(salesActivityService.findAll(dto))
                .message("Success")
                .code(200)
                .build());
    }
    @PutMapping(UPDATE)
    @Operation(summary = "Update sales activity by id")
    public ResponseEntity<ResponseDTO<Boolean>> update(@RequestBody SalesActivityUpdateDTO dto) {
        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(salesActivityService.update(dto))
                .message("Success")
                .code(200)
                .build());
    }
    @DeleteMapping(DELETE)
    @Operation(summary = "Delete sales activity by id")
    public ResponseEntity<ResponseDTO<Boolean>> delete(@RequestParam Long id) {
        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(salesActivityService.delete(id))
                .message("Success")
                .code(200)
                .build());
    }

}
