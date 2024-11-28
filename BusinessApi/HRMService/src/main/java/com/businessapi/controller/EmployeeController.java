package com.businessapi.controller;


import com.businessapi.dto.request.EmployeeSaveRequestDTO;
import com.businessapi.dto.request.EmployeeUpdateRequestDTO;
import com.businessapi.dto.response.BirthDateResponseDTO;
import com.businessapi.dto.response.EmployeeResponseDTO;
import com.businessapi.dto.response.PageRequestDTO;
import com.businessapi.dto.response.ResponseDTO;
import com.businessapi.entity.Employee;
import com.businessapi.service.EmployeeService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import static com.businessapi.constants.EndPoints.*;


@RestController
@RequestMapping(EMPLOYEE)
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EmployeeController {
    private  final EmployeeService employeeService;

    @PostMapping(SAVE)
    @Operation(summary = "Creates new Employee")
    public ResponseEntity<ResponseDTO<Boolean>> save(@RequestBody EmployeeSaveRequestDTO dto){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(employeeService.save(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @PutMapping(UPDATE)
    @Operation(summary = "Update Employee")
    public ResponseEntity<ResponseDTO<Boolean>> update(@RequestBody EmployeeUpdateRequestDTO dto){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(employeeService.update(dto))
                .message("Success")
                .code(200)
                .build());
    }
    @PostMapping (FIND_BY_ID)
    @Operation(summary = "Find employee by id")
    public ResponseEntity<ResponseDTO<EmployeeResponseDTO>> findById(@RequestParam Long id){

        return ResponseEntity.ok(ResponseDTO
                .<EmployeeResponseDTO>builder()
                .data(employeeService.findById(id))
                .message("Success")
                .code(200)
                .build());
    }


    @PostMapping (FIND_ALL)
    @Operation(summary = "Find all employee ")
    public ResponseEntity<ResponseDTO<List<Employee>>> findAll(@RequestBody PageRequestDTO dto){

        return ResponseEntity.ok(ResponseDTO
                .<List<Employee>>builder()
                .data(employeeService.searchByName(dto))
                .message("Success")
                .code(200)
                .build());
    }
    @DeleteMapping(DELETE)
    @Operation(summary = "Delete employee by id")
    public ResponseEntity<ResponseDTO<Boolean>> delete(@RequestParam Long id){
        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(employeeService.delete(id))
                .message("Success")
                .code(200)
                .build());
    }
    @PostMapping (NUMBER_MEN)
    @Operation(summary = "Number of employee men")
    public ResponseEntity<Long> numberOfEmployeeMen(){

        return ResponseEntity.ok(employeeService.numberOfEmployeeMen());

    }

    @PostMapping (NUMBER_WOMEN)
    @Operation(summary = "Number of employee women")
    public ResponseEntity<Long> numberOfEmployeeWomen(){

        return ResponseEntity.ok(employeeService.numberOfEmployeeWomen());

    }

    @PostMapping (NUMBER_DEPARTMENTS)
    @Operation(summary = "number of employees in departments")
    public ResponseEntity<Map<String, Long>> numberOfEmployeesInDepartments(){

        return ResponseEntity.ok(employeeService.numberOfEmployeesInDepartments());

    }

    @PostMapping (BIRTHDATE_LIST)
    @Operation(summary = "Find Upcoming Birthdays")
    public ResponseEntity<List<BirthDateResponseDTO> > findUpcomingBirthdays(){

        return ResponseEntity.ok(employeeService.findUpcomingBirthdays());

    }


}
