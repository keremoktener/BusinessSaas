package com.businessapi.controllers;

import com.businessapi.dto.request.*;
import com.businessapi.dto.response.ProductResponseDTO;
import com.businessapi.dto.response.ResponseDTO;
import com.businessapi.entities.Product;
import com.businessapi.services.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.businessapi.constants.Endpoints.*;

@RestController
@RequestMapping(ROOT + PRODUCT)
@RequiredArgsConstructor
@CrossOrigin("*")
public class ProductController
{
    private final ProductService productService;

    @PostMapping(SAVE)
    @Operation(summary = "Creates new Product")
    @PreAuthorize("hasAnyAuthority('IMM')")
    public ResponseEntity<ResponseDTO<Boolean>> save(@RequestBody ProductSaveRequestDTO dto){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(productService.save(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @DeleteMapping(DELETE)
    @Operation(summary = "Soft deletes Product")
    @PreAuthorize("hasAnyAuthority('IMM')")
    public ResponseEntity<ResponseDTO<Boolean>> delete(Long id){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(productService.delete(id))
                .message("Success")
                .code(200)
                .build());
    }

    @PutMapping(UPDATE)
    @Operation(summary = "Updates Product")
    @PreAuthorize("hasAnyAuthority('IMM')")
    public ResponseEntity<ResponseDTO<Boolean>> update(@RequestBody ProductUpdateRequestDTO dto){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(productService.update(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @PostMapping(FIND_ALL)
    @Operation(summary = "Finds all products with respect to pagination")
    @PreAuthorize("hasAnyAuthority('IMM')")
    public ResponseEntity<ResponseDTO<List<ProductResponseDTO>>> findAll(@RequestBody PageRequestDTO dto){

        return ResponseEntity.ok(ResponseDTO
                .<List<ProductResponseDTO>>builder()
                .data(productService.findAllByNameContainingIgnoreCaseAndStatusAndMemberIdOrderByName(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @PostMapping(FIND_BY_ID)
    @Operation(summary = "Finds Product by Id")
    @PreAuthorize("hasAnyAuthority('IMM')")
    public ResponseEntity<ResponseDTO<Product>> findById(Long id){

        return ResponseEntity.ok(ResponseDTO
                .<Product>builder()
                .data(productService.findByIdAndMemberId(id))
                .message("Success")
                .code(200)
                .build());
    }

    @PostMapping(FIND_ALL_BY_MINIMUM_STOCK_LEVEL)
    @Operation(summary = "Finds Product that have less stock than minimum stock level")
    @PreAuthorize("hasAnyAuthority('IMM')")
    public ResponseEntity<ResponseDTO<List<Product>>> findAllByMinimumStockLevel(@RequestBody PageRequestDTO dto){

        return ResponseEntity.ok(ResponseDTO
                .<List<Product>>builder()
                .data(productService.findAllByMinimumStockLevel(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @PostMapping(CHANGE_AUTO_ORDER_MODE+"/{id}")
    @Operation(summary = "Changes auto order mode for product")
    @PreAuthorize("hasAnyAuthority('IMM')")
    public ResponseEntity<ResponseDTO<Boolean>>changeAutoOrderMode(@PathVariable Long id){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(productService.changeAutoOrderMode(id))
                .message("Success")
                .code(200)
                .build());
    }

}
