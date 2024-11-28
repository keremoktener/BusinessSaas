package com.businessapi.controllers;

import com.businessapi.dto.request.DepartmentSaveRequestDto;
import com.businessapi.dto.request.DepartmentUpdateRequestDto;
import com.businessapi.dto.request.PageRequestDTO;
import com.businessapi.dto.response.ResponseDTO;
import com.businessapi.entities.Department;
import com.businessapi.services.DepartmentService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.businessapi.constants.Endpoints.*;

@RestController
@RequestMapping(ROOT + DEPARTMENT)
@RequiredArgsConstructor
@CrossOrigin("*")
public class DepartmentController
{
    private final DepartmentService departmentService;


    @PostMapping(SAVE)
    @Operation(summary = "Creates new department")
    @PreAuthorize("hasAnyAuthority('MEMBER')")
    public ResponseEntity<ResponseDTO<Boolean>> save(@RequestBody DepartmentSaveRequestDto dto){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(departmentService.save(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @DeleteMapping(DELETE)
    @Operation(summary = "Soft deletes Department")
    @PreAuthorize("hasAnyAuthority('MEMBER')")
    public ResponseEntity<ResponseDTO<Boolean>> delete(Long id){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(departmentService.delete(id))
                .message("Success")
                .code(200)
                .build());
    }

    @PutMapping(UPDATE)
    @Operation(summary = "Updates Department")
    @PreAuthorize("hasAnyAuthority('MEMBER')")
    public ResponseEntity<ResponseDTO<Boolean>> update(@RequestBody DepartmentUpdateRequestDto dto){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(departmentService.update(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @PostMapping(FIND_ALL)
    @Operation(summary = "Finds all Department with respect to pagination")
    @PreAuthorize("hasAnyAuthority('MEMBER')")
    public ResponseEntity<ResponseDTO<List<Department>>> findAll(@RequestBody PageRequestDTO dto){

        return ResponseEntity.ok(ResponseDTO
                .<List<Department>>builder()
                .data(departmentService.findAllByNameContainingIgnoreCaseAndMemberIdAndStatusIsNotOrderByNameAsc(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @PostMapping(FIND_BY_ID)
    @Operation(summary = "Finds Department by Id")
    @PreAuthorize("hasAnyAuthority('MEMBER')")
    public ResponseEntity<ResponseDTO<Department>> findById(Long id){

        return ResponseEntity.ok(ResponseDTO
                .<Department>builder()
                .data(departmentService.findByIdAndMemberId(id))
                .message("Success")
                .code(200)
                .build());
    }




}
