package com.businessapi.controllers;

import com.businessapi.dto.request.GenerateDeclarationRequestDTO;
import com.businessapi.dto.request.PageRequestDTO;
import com.businessapi.dto.response.DeclarationResponseDTO;
import com.businessapi.dto.response.ResponseDTO;
import com.businessapi.services.DeclarationService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

import static com.businessapi.constants.Endpoints.*;

@RestController
@RequestMapping(ROOT + DECLARATION)
@RequiredArgsConstructor
@CrossOrigin("*")
public class DeclarationController {
    private final DeclarationService declarationService;

    @PostMapping(CREATE)
    @Operation(summary = "Generates a declaration")
    @PreAuthorize("hasAnyAuthority('FAM')")
    public ResponseEntity<ResponseDTO<BigDecimal>> create(@RequestBody GenerateDeclarationRequestDTO dto) {
        return ResponseEntity.ok(ResponseDTO
                .<BigDecimal>builder()
                .data(declarationService.createDeclaration(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @PostMapping(FIND_ALL)
    @Operation(summary = "Lists all declarations with respect to the given page and size")
    @PreAuthorize("hasAnyAuthority('FAM')")
    public ResponseEntity<ResponseDTO<List<DeclarationResponseDTO>>> findAll(@RequestBody PageRequestDTO dto) {
        return ResponseEntity.ok(ResponseDTO
                .<List<DeclarationResponseDTO>>builder()
                .data(declarationService.getAllDeclarations(dto))
                .message("Success")
                .code(200)
                .build());
    }
}
