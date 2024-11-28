package com.businessapi.controllers;


import com.businessapi.dto.request.FeedbackSaveRequestDTO2;
import com.businessapi.dto.request.PageRequestDTO;
import com.businessapi.dto.response.FeedbackReportDTO;
import com.businessapi.dto.response.ResponseDTO;
import com.businessapi.entities.Feedback;
import com.businessapi.services.FeedbackService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.businessapi.constants.Endpoints.*;

@RequestMapping(ROOT + FEED_BACK)
@RestController
@RequiredArgsConstructor
@CrossOrigin("*")
public class FeedbackController {

    private final FeedbackService feedbackService;
    @CrossOrigin("*")
    @PostMapping(SAVE)
    @Operation(summary = "Creates new feedback")
    @PreAuthorize("hasAnyAuthority('MEMBER', 'ADMIN')")
    public ResponseEntity<ResponseDTO<Boolean>> save(@RequestBody FeedbackSaveRequestDTO2 dto){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(feedbackService.saveFeedback(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @DeleteMapping(DELETE)
    @Operation(summary = "Soft deletes feedback")
    @PreAuthorize("hasAnyAuthority('MEMBER')")
    public ResponseEntity<ResponseDTO<Boolean>> delete(){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(feedbackService.deleteFeedback())
                .message("Success")
                .code(200)
                .build());
    }

    @PostMapping(UPDATE)
    @Operation(summary = "Updates feedback")
    @PreAuthorize("hasAnyAuthority('MEMBER')")
    public ResponseEntity<ResponseDTO<Boolean>> update(@RequestBody FeedbackSaveRequestDTO2 dto){
        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(feedbackService.updateFeedback(dto))
                .message("Success")
                .code(200)
                .build());
    }

    @GetMapping(REPORT)
    @Operation(summary = "Gets feedback report")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<FeedbackReportDTO> getFeedbackReport() {
        return ResponseEntity.ok(feedbackService.getFeedbackReport());
    }

    @GetMapping(GET_USER_FEEDBACK)
    @Operation(summary = "Get feedback by authenticated user")
    @PreAuthorize("hasAnyAuthority('MEMBER')")
    public ResponseEntity<Feedback> getFeedbackUser() {
        Feedback feedbacks = feedbackService.getFeedbackByUser();
        return ResponseEntity.ok(feedbacks);
    }

    @PostMapping(FIND_ALL)
    @Operation(summary = "Get all feedbacks")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<ResponseDTO<List<Feedback>>> getAllFeedbacks(@RequestBody PageRequestDTO dto) {
        return ResponseEntity.ok(
                ResponseDTO.<List<Feedback>>builder()
                        .data(feedbackService.getAllFeedbacks(dto))
                        .message("Success")
                        .code(200)
                        .build()
        );
    }
}




