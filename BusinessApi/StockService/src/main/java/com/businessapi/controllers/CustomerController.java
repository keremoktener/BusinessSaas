package com.businessapi.controllers;

import com.businessapi.dto.request.PageRequestDTO;
import com.businessapi.dto.response.CustomerSaveRequestDTO;
import com.businessapi.dto.response.CustomerUpdateRequestDTO;
import com.businessapi.dto.response.ResponseDTO;
import com.businessapi.entities.Customer;
import com.businessapi.services.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.businessapi.constants.Endpoints.*;

@RestController
@RequestMapping(ROOT + CUSTOMER)
@RequiredArgsConstructor
@CrossOrigin("*")
public class CustomerController
{
    private final CustomerService customerService;

    @PostMapping(SAVE)
    @Operation(summary = "Creates new customer")
    @PreAuthorize("hasAnyAuthority('IMM')")
    public ResponseEntity<ResponseDTO<Boolean>> save(@RequestBody CustomerSaveRequestDTO dto){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(customerService.save(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @DeleteMapping(DELETE)
    @Operation(summary = "Soft deletes Stock customer")
    @PreAuthorize("hasAnyAuthority('IMM')")
    public ResponseEntity<ResponseDTO<Boolean>> delete(Long id){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(customerService.delete(id))
                .message("Success")
                .code(200)
                .build());
    }

    @PutMapping(UPDATE)
    @Operation(summary = "Updates customer")
    @PreAuthorize("hasAnyAuthority('IMM')")
    public ResponseEntity<ResponseDTO<Boolean>> update(@RequestBody CustomerUpdateRequestDTO dto){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(customerService.update(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @PostMapping(FIND_ALL)
    @Operation(summary = "Finds all customers")
    @PreAuthorize("hasAnyAuthority('IMM')")
    public ResponseEntity<ResponseDTO<List<Customer>>> findAll(@RequestBody PageRequestDTO dto){

        return ResponseEntity.ok(ResponseDTO
                .<List<Customer>>builder()
                .data(customerService.findAllByNameContainingIgnoreCaseAndStatusIsNotAndMemberIdOrderByNameAsc(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @PostMapping(FIND_BY_ID)
    @Operation(summary = "Finds customer by Id")
    @PreAuthorize("hasAnyAuthority('IMM')")
    public ResponseEntity<ResponseDTO<Customer>> findById(Long id){

        return ResponseEntity.ok(ResponseDTO
                .<Customer>builder()
                .data(customerService.findByIdAndMemberId(id))
                .message("Success")
                .code(200)
                .build());
    }
}
