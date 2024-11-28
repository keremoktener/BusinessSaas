package com.businessapi.controller;

import com.businessapi.dto.request.SaveFaqRequestDto;
import com.businessapi.dto.request.UpdateFaqRequestDto;
import com.businessapi.dto.response.ResponseDTO;
import com.businessapi.entity.Faq;
import com.businessapi.entity.Message;
import com.businessapi.service.FaqService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.businessapi.constants.Endpoints.*;

@RestController
@RequestMapping(ROOT+FAQ)
@RequiredArgsConstructor
@CrossOrigin("*")
public class FaqController {
    private final FaqService faqService;

    @PostMapping(FIND_ALL)
    @Operation(summary = "Find all faqs")
    public ResponseEntity<ResponseDTO<List<Faq>>>  getAllFaqs() {
        return ResponseEntity.ok(ResponseDTO
                .<List<Faq>>builder()
                .data(faqService.getAllFaqs())
                .message("Success")
                .code(200)
                .build());
    }
    @PostMapping(SAVE)
    @PreAuthorize("hasAnyAuthority('SUPPORTER')")
    @Operation(summary = "Create new faq", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ResponseDTO<Faq>> createFaq(@RequestBody SaveFaqRequestDto dto) {
        Faq faq = Faq.builder().
                question(dto.question()).
                answer(dto.answer()).
                build();
        return ResponseEntity.ok(ResponseDTO
                .<Faq>builder()
                .data(faqService.save(faq))
                .message("Success")
                .code(200)
                .build());

    }

    @PostMapping(UPDATE)
    @PreAuthorize("hasAnyAuthority('SUPPORTER')")
    @Operation(summary = "Create new faq", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ResponseDTO<Faq>> createFaq(@RequestBody UpdateFaqRequestDto dto) {
        Faq faq = Faq.builder().
                id(dto.id()).
                question(dto.question()).
                answer(dto.answer()).
                build();
        return ResponseEntity.ok(ResponseDTO
                .<Faq>builder()
                .data(faqService.save(faq))
                .message("Success")
                .code(200)
                .build());

    }

    @PostMapping(DELETE)
    @PreAuthorize("hasAnyAuthority('SUPPORTER')")
    @Operation(summary = "Create new faq", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ResponseDTO<Faq>> createFaq(@RequestParam Long id) {
        return ResponseEntity.ok(ResponseDTO
                .<Faq>builder()
                .data(faqService.delete(id))
                .message("Success")
                .code(200)
                .build());

    }
}