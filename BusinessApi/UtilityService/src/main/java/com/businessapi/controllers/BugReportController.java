package com.businessapi.controllers;

import static com.businessapi.constants.Endpoints.*;

import com.businessapi.dto.request.BugReportSaveRequestDTO;
import com.businessapi.dto.request.BugReportUpdateStatusRequestDTO;
import com.businessapi.dto.request.FeedbackSaveRequestDTO;
import com.businessapi.dto.request.PageRequestDTO;
import com.businessapi.dto.response.BugReportResponseDTO;
import com.businessapi.dto.response.ResponseDTO;
import com.businessapi.entities.BugReport;
import com.businessapi.services.BugReportService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping(ROOT + BUG_REPORT)
@RestController
@RequiredArgsConstructor
@CrossOrigin("*")
public class BugReportController
{
    private final BugReportService bugReportService;

    @PostMapping(SAVE)
    @Operation(summary = "Creates new bug report")
    @PreAuthorize("hasAnyAuthority('MEMBER','ADMIN')")
    public ResponseEntity<ResponseDTO<Boolean>> save(@RequestBody BugReportSaveRequestDTO dto){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(bugReportService.save(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @DeleteMapping(DELETE)
    @Operation(summary = "Soft deletes Bug Report")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<ResponseDTO<Boolean>> delete(Long id){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(bugReportService.delete(id))
                .message("Success")
                .code(200)
                .build());
    }

    @PutMapping(UPDATE)
    @Operation(summary = "Updates Bug Report")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<ResponseDTO<Boolean>> updateStatus(@RequestBody BugReportUpdateStatusRequestDTO dto){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(bugReportService.updateStatus(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @PostMapping(FIND_ALL)
    @Operation(summary = "Finds all Bug Reports with respect to pagination")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<ResponseDTO<List<BugReportResponseDTO>>> findAll(@RequestBody PageRequestDTO dto){

        return ResponseEntity.ok(ResponseDTO
                .<List<BugReportResponseDTO>>builder()
                .data(bugReportService.findAllByDescriptionContainingIgnoreCaseAndStatusIsNotOrderByDescriptionAsc(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @PostMapping(FIND_BY_ID)
    @Operation(summary = "Finds Bug Report by Id")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<ResponseDTO<BugReport>> findById(Long id){

        return ResponseEntity.ok(ResponseDTO
                .<BugReport>builder()
                .data(bugReportService.findById(id))
                .message("Success")
                .code(200)
                .build());
    }

    @PutMapping(FEEDBACK)
    @Operation(summary = "Gives feedback to member")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<ResponseDTO<Boolean>> feedback(@RequestBody FeedbackSaveRequestDTO dto){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(bugReportService.feedback(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @PostMapping(REOPEN_CASE)
    @Operation(summary = "Reopens and resets the case and increasing its version by 1")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<ResponseDTO<Boolean>> reopenCase(Long id){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(bugReportService.reopenCase(id))
                .message("Success")
                .code(200)
                .build());
    }
}
