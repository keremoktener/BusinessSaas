package com.businessapi.controllers;

import com.businessapi.dto.request.*;
import com.businessapi.dto.response.EmployeeFindByIdResponseDTO;
import com.businessapi.dto.response.EmployeeResponseDTO;
import com.businessapi.dto.response.OrganizationNodeDTO;
import com.businessapi.dto.response.ResponseDTO;
import com.businessapi.services.EmployeeService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.businessapi.constants.Endpoints.*;

@RestController
@RequestMapping(ROOT + EMPLOYEE)
@RequiredArgsConstructor
@CrossOrigin("*")
public class EmployeeController
{
    private final EmployeeService employeeService;


    @PostMapping(SAVE)
    @Operation(summary = "Creates new Employee")
    @PreAuthorize("hasAnyAuthority('MEMBER')")
    public ResponseEntity<ResponseDTO<Boolean>> save(@RequestBody EmployeeSaveRequestDto dto){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(employeeService.save(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @PostMapping(SAVE_SUBORDINATE)
    @Operation(summary = "Creates new Employee with subordinates")
    @PreAuthorize("hasAnyAuthority('MEMBER')")
    public ResponseEntity<ResponseDTO<Boolean>> saveSubordinates(@RequestBody SubordinateSaveRequestDTO dto){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(employeeService.saveSubordinates(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @PostMapping(SAVE_TOP_LEVEL_MANAGER)
    @Operation(summary = "Creates new Top Level Manager")
    @PreAuthorize("hasAnyAuthority('MEMBER')")
    public ResponseEntity<ResponseDTO<Boolean>> saveTopLevelManager(@RequestBody ManagerSaveRequestDto dto){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(employeeService.saveTopLevelManager(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @DeleteMapping(DELETE)
    @Operation(summary = "Soft deletes Employee")
    @PreAuthorize("hasAnyAuthority('MEMBER')")
    public ResponseEntity<ResponseDTO<Boolean>> delete(Long id){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(employeeService.delete(id))
                .message("Success")
                .code(200)
                .build());
    }

    @PutMapping(UPDATE)
    @Operation(summary = "Updates Employee")
    @PreAuthorize("hasAnyAuthority('MEMBER')")
    public ResponseEntity<ResponseDTO<Boolean>> update(@RequestBody EmployeeUpdateRequestDto dto){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(employeeService.update(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @PostMapping(FIND_ALL)
    @Operation(summary = "Finds all Employee with respect to pagination")
    @PreAuthorize("hasAnyAuthority('MEMBER')")
    public ResponseEntity<ResponseDTO<List<EmployeeResponseDTO>>> findAll(@RequestBody PageRequestDTO dto){

        return ResponseEntity.ok(ResponseDTO
                .<List<EmployeeResponseDTO>>builder()
                .data(employeeService.findAllByNameContainingIgnoreCaseAndMemberIdAndStatusIsNotOrderByNameAsc(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @PostMapping(FIND_BY_ID)
    @Operation(summary = "Finds Employee by Id")
    @PreAuthorize("hasAnyAuthority('MEMBER')")
    public ResponseEntity<ResponseDTO<EmployeeFindByIdResponseDTO>> findById(Long id){

        return ResponseEntity.ok(ResponseDTO
                .<EmployeeFindByIdResponseDTO>builder()
                .data(employeeService.findByIdAndMemberId(id))
                .message("Success")
                .code(200)
                .build());
    }

    @PostMapping(GET_EMPLOYEE_HIERARCHY)
    @Operation(summary = "Finds Employee hierarchy")
    @PreAuthorize("hasAnyAuthority('MEMBER')")
    public ResponseEntity<ResponseDTO<List<OrganizationNodeDTO>>> getEmployeeHierarchy(){

        return ResponseEntity.ok(ResponseDTO
                .<List<OrganizationNodeDTO>>builder()
                .data(employeeService.getEmployeeHierarchy())
                .message("Success")
                .code(200)
                .build());
    }

    @PostMapping(CHANGE_IS_ACCOUNT_GIVEN_TO_EMPLOYEE_STATE)
    @Operation(summary = "Changes state of is account given to employee. Also creates user and auth for employee if not exist.")
    @PreAuthorize("hasAnyAuthority('MEMBER')")
    public ResponseEntity<ResponseDTO<Boolean>> changeIsAccountGivenToEmployeeState(Long id){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(employeeService.changeIsAccountGivenToEmployeeState(id))
                .message("Success")
                .code(200)
                .build());
    }





}
