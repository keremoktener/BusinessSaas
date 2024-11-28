package com.businessapi.controller;


import com.businessapi.dto.request.EmployeeSaveRequestDTO;
import com.businessapi.dto.request.EmployeeUpdateRequestDTO;
import com.businessapi.dto.request.PayrollSaveRequestDTO;
import com.businessapi.dto.request.PayrollUpdateRequestDTO;
import com.businessapi.dto.response.EmployeeResponseDTO;
import com.businessapi.dto.response.PageRequestDTO;
import com.businessapi.dto.response.PayrollResponseDTO;
import com.businessapi.dto.response.ResponseDTO;
import com.businessapi.entity.Payroll;
import com.businessapi.service.PayrollService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.businessapi.constants.EndPoints.*;

@RestController
@RequestMapping(PAYROLL)
@RequiredArgsConstructor
@CrossOrigin(origins = "*", methods = {RequestMethod.POST, RequestMethod.GET, RequestMethod.PUT,RequestMethod.DELETE})
public class PayrollController {
    private  final PayrollService payrollService;
    @PostMapping(SAVE)
    @Operation(summary = "Creates new Payroll")
    public ResponseEntity<ResponseDTO<Boolean>> save(@RequestBody PayrollSaveRequestDTO dto){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(payrollService.save(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @PutMapping(UPDATE)
    @Operation(summary = "Update Payroll")
    public ResponseEntity<ResponseDTO<Boolean>> update(@RequestBody PayrollUpdateRequestDTO dto){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(payrollService.update(dto))
                .message("Success")
                .code(200)
                .build());
    }
    @PostMapping (FIND_BY_ID)
    @Operation(summary = "Find payroll by id")
    public ResponseEntity<ResponseDTO<PayrollResponseDTO>> findById(@RequestParam Long id){

        return ResponseEntity.ok(ResponseDTO
                .<PayrollResponseDTO>builder()
                .data(payrollService.findById(id))
                .message("Success")
                .code(200)
                .build());
    }
    @PostMapping (FIND_ALL)
    @Operation(summary = "Find all payroll ")
    public ResponseEntity<ResponseDTO<List<PayrollResponseDTO>>> findAll(@RequestBody PageRequestDTO dto){

        return ResponseEntity.ok(ResponseDTO
                .<List<PayrollResponseDTO>>builder()
                .data(payrollService.findAll(dto))
                .message("Success")
                .code(200)
                .build());
    }
    @DeleteMapping(DELETE)
    @Operation(summary = "Delete payroll by id")
    public ResponseEntity<ResponseDTO<Boolean>> delete(@RequestParam Long id){
        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(payrollService.delete(id))
                .message("Success")
                .code(200)
                .build());
    }

}
