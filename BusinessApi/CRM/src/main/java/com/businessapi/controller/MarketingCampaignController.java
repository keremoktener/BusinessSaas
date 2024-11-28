package com.businessapi.controller;

import com.businessapi.dto.request.MarketingCampaignSaveDTO;
import com.businessapi.dto.request.MarketingCampaignUpdateDTO;
import com.businessapi.dto.request.PageRequestDTO;
import com.businessapi.dto.response.ResponseDTO;
import com.businessapi.entity.MarketingCampaign;
import com.businessapi.service.MarketingCampaignService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.businessapi.constants.EndPoints.*;

@RestController
@RequestMapping(MARKETINGCAMPAIGN)
@RequiredArgsConstructor
@CrossOrigin("*")
public class MarketingCampaignController {
    private final MarketingCampaignService marketingCampaignService;

    @PostMapping(SAVE)
    @Operation(summary = "Save marketing campaign", description = "Save marketing campaign")
    public ResponseEntity<ResponseDTO<Boolean>> save(@RequestBody MarketingCampaignSaveDTO dto) {
        return ResponseEntity.ok(ResponseDTO.<Boolean>builder()
                .data(marketingCampaignService.save(dto))
                .code(200)
                .message("Marketing campaign saved successfully")
                .build());
    }
    @PostMapping(FINDALL)
    @Operation(summary = "Find all marketing campaigns", description = "Find all marketing campaigns")
    public ResponseEntity<ResponseDTO<List<MarketingCampaign>>> findAll(@RequestBody PageRequestDTO dto) {
        return ResponseEntity.ok(ResponseDTO.<List<MarketingCampaign>>builder()
                .data(marketingCampaignService.findAll(dto))
                .code(200)
                .message("Marketing campaigns found successfully")
                .build());
    }
    @PutMapping(UPDATE)
    @Operation(summary = "Update marketing campaign by id",description = "Update marketing campaign by id")
    public ResponseEntity<ResponseDTO<Boolean>> update(@RequestBody MarketingCampaignUpdateDTO dto) {
        return ResponseEntity.ok(ResponseDTO.<Boolean>builder()
                .data(marketingCampaignService.update(dto))
                .code(200)
                .message("Marketing campaign updated successfully")
                .build());
    }

    @DeleteMapping(DELETE)
    @Operation(summary = "Delete marketing campaign",description = "Delete marketing campaign")
    public ResponseEntity<ResponseDTO<Boolean>> delete(@RequestParam Long id) {
        return ResponseEntity.ok(ResponseDTO.<Boolean>builder()
                .data(marketingCampaignService.delete(id))
                .code(200)
                .message("Marketing campaign deleted successfully")
                .build());
    }
    @PostMapping(FINDBYID)
    @Operation(summary = "Find marketingcampaign by id",description = "Find marketingcampaign  by id")
    public ResponseEntity<ResponseDTO<MarketingCampaign>> findById(@RequestParam Long id) {
        return ResponseEntity.ok(ResponseDTO.<MarketingCampaign>builder()
                .data(marketingCampaignService.findById(id))
                .code(200)
                .message("Marketing campaign found successfully")
                .build());
    }

}
