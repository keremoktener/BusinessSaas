package com.businessapi.controller;


import com.businessapi.dto.request.PerformanceSaveRequestDTO;
import com.businessapi.dto.request.PerformanceUpdateRequestDTO;

import com.businessapi.dto.response.*;

import com.businessapi.service.PerformanceService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.businessapi.constants.EndPoints.*;

@RestController
@RequestMapping(PERFORMANCE)
@RequiredArgsConstructor
@CrossOrigin(origins = "*", methods = {RequestMethod.POST, RequestMethod.GET, RequestMethod.PUT,RequestMethod.DELETE})
public class PerformanceController {
    private  final PerformanceService performanceService;

    @PostMapping(SAVE)
    @Operation(summary = "Creates new Performance")
    public ResponseEntity<ResponseDTO<Boolean>> save(@RequestBody PerformanceSaveRequestDTO dto){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(performanceService.save(dto))
                .message("Success")
                .code(200)
                .build());
    }
    @PutMapping(UPDATE)
    @Operation(summary = "Update Performance")
    public ResponseEntity<ResponseDTO<Boolean>> update(@RequestBody PerformanceUpdateRequestDTO dto){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(performanceService.update(dto))
                .message("Success")
                .code(200)
                .build());
    }
    @GetMapping (FIND_BY_ID)
    @Operation(summary = "Find Performance by id")
    public ResponseEntity<ResponseDTO<PerformanceResponseDTO>> findById(@RequestParam Long id){

        return ResponseEntity.ok(ResponseDTO
                .<PerformanceResponseDTO>builder()
                .data(performanceService.findById(id))
                .message("Success")
                .code(200)
                .build());
    }
    @PostMapping (FIND_ALL)
    @Operation(summary = "Find all Performance ")
    public ResponseEntity<ResponseDTO<List<PerformanceResponseDTO>>> findAll(@RequestBody PageRequestDTO dto){

        return ResponseEntity.ok(ResponseDTO
                .<List<PerformanceResponseDTO>>builder()
                .data(performanceService.findAll(dto))
                .message("Success")
                .code(200)
                .build());
    }
    @DeleteMapping(DELETE)
    @Operation(summary = "Delete Performance by id")
    public ResponseEntity<ResponseDTO<Boolean>> delete(@RequestParam Long id){
        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(performanceService.delete(id))
                .message("Success")
                .code(200)
                .build());
    }
    @PostMapping (DEPARTMENT_SCORE)
    @Operation(summary = "Get Department Average Scores")
    public ResponseEntity<List<DepartmentScoreResponseDTO> > getDepartmentAverageScores(){

        return ResponseEntity.ok(performanceService.getDepartmentAverageScores());

    }
}
