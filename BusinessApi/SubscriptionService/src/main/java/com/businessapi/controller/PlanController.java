package com.businessapi.controller;

import com.businessapi.dto.request.PlanSaveRequestDTO;
import com.businessapi.dto.request.PlanUpdateRequestDTO;
import com.businessapi.dto.response.PlanGetResponseDTO;
import com.businessapi.dto.response.ResponseDTO;
import com.businessapi.entity.Plan;
import com.businessapi.service.PlanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.businessapi.constants.Endpoints.*;

@RestController
@RequestMapping(ROOT + PLAN)
@RequiredArgsConstructor
@CrossOrigin("*")
public class PlanController {
    private final PlanService planService;
    @PostMapping(SAVE)
    @PreAuthorize("hasAnyAuthority('SUPER_ADMIN','ADMIN')")
    @Operation(summary = "Creates new subscription plan", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ResponseDTO<Plan>> saveSubscriptionPlan(@RequestBody PlanSaveRequestDTO dto){
        return ResponseEntity.ok(ResponseDTO
                .<Plan>builder()
                .data(planService.save(dto))
                .message("Success")
                .code(200)
                .build());
    }
    @PostMapping(FIND_ALL)
    @PreAuthorize("hasAnyAuthority('SUPER_ADMIN','ADMIN','MEMBER')")
    @Operation(summary = "Get all subscription plans", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ResponseDTO<List<Plan>>> FindAllSubscriptionPlans(){
        return ResponseEntity.ok(ResponseDTO
                .<List<Plan>>builder()
                .data(planService.findAll())
                .message("Success")
                .code(200)
                .build());
    }

    @GetMapping(FIND_BY_ID)
    @PreAuthorize("hasAnyAuthority('SUPER_ADMIN','ADMIN')")
    @Operation(summary = "Get subscription plan by id", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ResponseDTO<Plan>> FindSubscriptionPlanById(@RequestParam Long id){
        return ResponseEntity.ok(ResponseDTO
                .<Plan>builder()
                .data(planService.findById(id))
                .message("Success")
                .code(200)
                .build());
    }

    @DeleteMapping(DELETE)
    @PreAuthorize("hasAnyAuthority('SUPER_ADMIN','ADMIN')")
    @Operation(summary = "Delete subscription plan by id", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ResponseDTO<Boolean>> DeleteSubscriptionPlanById(@RequestParam Long id){
        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(planService.delete(id))
                .message("Success")
                .code(200)
                .build());
    }

    @PostMapping(UPDATE)
    @PreAuthorize("hasAnyAuthority('SUPER_ADMIN','ADMIN')")
    @Operation(summary = "Update subscription plan by id", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ResponseDTO<Plan>> UpdateSubscriptionPlanById(@RequestBody PlanUpdateRequestDTO dto){
        return ResponseEntity.ok(ResponseDTO
                .<Plan>builder()
                .data(planService.update(dto))
                .message("Success")
                .code(200)
                .build());
    }
}
