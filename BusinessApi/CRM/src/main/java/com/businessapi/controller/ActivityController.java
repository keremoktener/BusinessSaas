package com.businessapi.controller;

import com.businessapi.dto.request.PageRequestDTO;
import com.businessapi.dto.response.ResponseDTO;
import com.businessapi.entity.Activities;
import com.businessapi.service.ActivityService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.businessapi.constants.EndPoints.*;

@RestController
@RequestMapping(ACTIVITIES)
@RequiredArgsConstructor
@CrossOrigin("*")
public class ActivityController {
    private final ActivityService service;

    @PostMapping(FINDALL)
    @Operation(summary = "Find all activities", description = "Find all activities")
    public ResponseEntity<ResponseDTO<List<Activities>>> findAll(@RequestBody PageRequestDTO dto) {
        return ResponseEntity.ok(ResponseDTO.<List<Activities>>builder()
                .data(service.findAll(dto))
                .code(200)
                .message("Activities found successfully")
                .build());
    }
//    @PostMapping(FINDALL)
//    @Operation(summary = "Find all activities", description = "Find all activities")
//    public ResponseEntity<ResponseDTO<List<Activities>>> findAll() {
//        return ResponseEntity.ok(ResponseDTO.<List<Activities>>builder()
//                .data(service.findAll())
//                .code(200)
//                .message("Activities found successfully")
//                .build());
//    }
    @PostMapping(FINDBYID)
    @Operation(summary = "Find activity by id", description = "Find activity by id")
    public ResponseEntity<ResponseDTO<Activities>> findById(@RequestParam String uuid) {
        return ResponseEntity.ok(ResponseDTO.<Activities>builder()
                .data(service.findById(uuid))
                .code(200)
                .message("Activity found successfully")
                .build());
    }



}
