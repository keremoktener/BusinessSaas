package com.businessapi.controllers;

import com.businessapi.dto.request.*;
import com.businessapi.dto.response.ResponseDTO;
import com.businessapi.entities.Supplier;
import com.businessapi.services.SupplierService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.businessapi.constants.Endpoints.*;

@RestController
@RequestMapping(ROOT + SUPPLIER)
@RequiredArgsConstructor
@CrossOrigin("*")
public class SupplierController
{
    private final SupplierService supplierService;

    @PostMapping(SAVE)
    @Operation(summary = "Creates new Supplier")
    @PreAuthorize("hasAnyAuthority('IMM')")
    public ResponseEntity<ResponseDTO<Boolean>> save(@RequestBody SupplierSaveRequestDTO dto){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(supplierService.save(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @DeleteMapping(DELETE)
    @Operation(summary = "Soft deletes Supplier")
    @PreAuthorize("hasAnyAuthority('IMM')")
    public ResponseEntity<ResponseDTO<Boolean>> delete(Long id){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(supplierService.delete(id))
                .message("Success")
                .code(200)
                .build());
    }

    @PutMapping(UPDATE)
    @Operation(summary = "Updates Supplier")
    @PreAuthorize("hasAnyAuthority('IMM')")
    public ResponseEntity<ResponseDTO<Boolean>> update(@RequestBody SupplierUpdateRequestDTO dto){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(supplierService.update(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @PostMapping(FIND_ALL)
    @Operation(summary = "Finds all Suppliers with respect to pagination")
    @PreAuthorize("hasAnyAuthority('IMM')")
    public ResponseEntity<ResponseDTO<List<Supplier>>> findAll(@RequestBody PageRequestDTO dto){

        return ResponseEntity.ok(ResponseDTO
                .<List<Supplier>>builder()
                .data(supplierService.findAllByNameContainingIgnoreCaseAndMemberIdAndStatusIsNotOrderByNameAsc(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @PostMapping(FIND_BY_ID)
    @Operation(summary = "Finds Supplier by Id")
    @PreAuthorize("hasAnyAuthority('IMM')")
    public ResponseEntity<ResponseDTO<Supplier>> findById(Long id){

        return ResponseEntity.ok(ResponseDTO
                .<Supplier>builder()
                .data(supplierService.findByIdAndMemberId(id))
                .message("Success")
                .code(200)
                .build());
    }


    @PostMapping(APPROVE_ORDER)
    @Operation(summary = "Approves buy orders")
    @PreAuthorize("hasAnyAuthority('SUPPLIER')")
    public ResponseEntity<ResponseDTO<Boolean>> approveOrder(Long id){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(supplierService.approveOrder(id))
                .message("Success")
                .code(200)
                .build());
    }
}
