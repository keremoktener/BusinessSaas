package com.businessapi.controllers;

import static com.businessapi.constants.Endpoints.*;

import com.businessapi.dto.response.DepartmentResponseDTO;
import com.businessapi.dto.response.ResponseDTO;
import com.businessapi.services.DepartmentService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(ROOT + DEPARTMENT)
@CrossOrigin("*")
public class DepartmentController {
    private final DepartmentService departmentService;

    @PostMapping(GET_DEPARTMENTS)
    @Operation(summary = "Lists all departments with name and id")
    @PreAuthorize("hasAnyAuthority('FAM')")
    public ResponseEntity<ResponseDTO<List<DepartmentResponseDTO>>> getDepartments() {
        return ResponseEntity.ok(ResponseDTO
                .<List<DepartmentResponseDTO>>builder()
                .data(departmentService.getAllDepartments())
                .message("Success")
                .code(200)
                .build());
    }

}
