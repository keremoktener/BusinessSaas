package com.businessapi.controller;


import com.businessapi.dto.request.BenefitSaveRequestDTO;
import com.businessapi.dto.request.BenefitUpdateRequestDTO;
import com.businessapi.dto.request.EmployeeSaveRequestDTO;
import com.businessapi.dto.request.EmployeeUpdateRequestDTO;
import com.businessapi.dto.response.BenefitResponseDTO;
import com.businessapi.dto.response.EmployeeResponseDTO;
import com.businessapi.dto.response.PageRequestDTO;
import com.businessapi.dto.response.ResponseDTO;
import com.businessapi.service.BenefitService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.businessapi.constants.EndPoints.*;

@RestController
@RequestMapping(BENEFIT)
@RequiredArgsConstructor
@CrossOrigin(origins = "*", methods = {RequestMethod.POST, RequestMethod.GET, RequestMethod.PUT,RequestMethod.DELETE})
public class BenefitController {
    private  final BenefitService benefitService;

    @PostMapping(SAVE)
    @Operation(summary = "Creates new Benefit")
    public ResponseEntity<ResponseDTO<Boolean>> save(@RequestBody BenefitSaveRequestDTO dto){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(benefitService.save(dto))
                .message("Success")
                .code(200)
                .build());
    }
    @PutMapping(UPDATE)
    @Operation(summary = "Update Benefit")
    public ResponseEntity<ResponseDTO<Boolean>> update(@RequestBody BenefitUpdateRequestDTO dto){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(benefitService.update(dto))
                .message("Success")
                .code(200)
                .build());
    }
    @PostMapping (FIND_BY_ID)
    @Operation(summary = "Find Benefit by id")
    public ResponseEntity<ResponseDTO<BenefitResponseDTO>> findById(@RequestParam Long id){

        return ResponseEntity.ok(ResponseDTO
                .<BenefitResponseDTO>builder()
                .data(benefitService.findById(id))
                .message("Success")
                .code(200)
                .build());
    }
    @PostMapping (FIND_ALL)
    @Operation(summary = "Find all Benefit ")
    public ResponseEntity<ResponseDTO<List<BenefitResponseDTO>>> findAll(@RequestBody PageRequestDTO dto){

        return ResponseEntity.ok(ResponseDTO
                .<List<BenefitResponseDTO>>builder()
                .data(benefitService.findAll(dto))
                .message("Success")
                .code(200)
                .build());
    }
    @DeleteMapping(DELETE)
    @Operation(summary = "Delete Benefit by id")
    public ResponseEntity<ResponseDTO<Boolean>> delete(@RequestParam Long id){
        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(benefitService.delete(id))
                .message("Success")
                .code(200)
                .build());
    }












}
