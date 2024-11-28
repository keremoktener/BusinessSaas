package com.businessapi.controllers;

import com.businessapi.dto.request.*;
import com.businessapi.dto.response.ResponseDTO;
import com.businessapi.entities.ProductCategory;
import com.businessapi.services.ProductCategoryService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.businessapi.constants.Endpoints.*;

@RestController
@RequestMapping(ROOT + PRODUCTCATEGORY)
@RequiredArgsConstructor
@CrossOrigin("*")
public class ProductCategoryController
{
    private final ProductCategoryService productCategoryService;

    @PostMapping(SAVE)
    @Operation(summary = "Creates new Product Category")
    @PreAuthorize("hasAnyAuthority('IMM')")
    public ResponseEntity<ResponseDTO<Boolean>> save(@RequestBody ProductCategorySaveRequestDTO dto){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(productCategoryService.save(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @DeleteMapping(DELETE)
    @Operation(summary = "Soft deletes Product Category")
    @PreAuthorize("hasAnyAuthority('IMM')")
    public ResponseEntity<ResponseDTO<Boolean>> delete(Long id){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(productCategoryService.delete(id))
                .message("Success")
                .code(200)
                .build());
    }

    @PutMapping(UPDATE)
    @Operation(summary = "Updates Product Category")
    @PreAuthorize("hasAnyAuthority('IMM')")
    public ResponseEntity<ResponseDTO<Boolean>> update(@RequestBody ProductCategoryUpdateRequestDTO dto){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(productCategoryService.update(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @PostMapping(FIND_ALL)
    @Operation(summary = "Finds all Product Categories with respect to pagination")
    @PreAuthorize("hasAnyAuthority('IMM')")
    public ResponseEntity<ResponseDTO<List<ProductCategory>>> findAll(@RequestBody PageRequestDTO dto){

        return ResponseEntity.ok(ResponseDTO
                .<List<ProductCategory>>builder()
                .data(productCategoryService.findAllByNameContainingIgnoreCaseAndMemberIdAndStatusIsNotOrderByNameAsc(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @PostMapping(FIND_BY_ID)
    @Operation(summary = "Finds Product Category by Id")
    @PreAuthorize("hasAnyAuthority('IMM')")
    public ResponseEntity<ResponseDTO<ProductCategory>> findById(Long id){

        return ResponseEntity.ok(ResponseDTO
                .<ProductCategory>builder()
                .data(productCategoryService.findByIdAndMemberId(id))
                .message("Success")
                .code(200)
                .build());
    }
}
