package com.businessapi.controller;

import com.businessapi.constants.EndPoints;
import com.businessapi.dto.request.*;
import com.businessapi.dto.response.ResponseDTO;
import com.businessapi.entity.Event;
import com.businessapi.service.EventService;
import com.businessapi.util.JwtTokenManager;
import com.businessapi.views.EventWithStatusView;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.businessapi.constants.EndPoints.*;

@RequiredArgsConstructor
@RestController
@RequestMapping(EndPoints.EVENT)
@CrossOrigin(origins = "*")
public class EventController {
    private final EventService eventService;
    private final JwtTokenManager jwtTokenManager;

    @PostMapping(SAVE)
    @Operation(summary = "Create event", description = "Create event")
    public ResponseEntity<ResponseDTO<Boolean>> save(@RequestBody EventSaveRequestDTO eventSaveRequestDTO) {
        return ResponseEntity.ok(ResponseDTO.<Boolean>builder()
                .data(eventService.save(eventSaveRequestDTO))
                .code(200)
                .message("Event saved successfully").build());
    }

    @DeleteMapping(DELETE_EVENT_BY_CREATOR)
    @Operation(summary = "Delete event by creator", description = "Delete event created by the user")
    public ResponseEntity<ResponseDTO<Boolean>> deleteByCreator(@RequestBody EventDeleteRequestDTO eventDeleteRequestDTO) {
        return ResponseEntity.ok(ResponseDTO.<Boolean>builder()
                .data(eventService.deleteByCreator(eventDeleteRequestDTO))
                .code(200)
                .message("Event deleted successfully by creator").build());
    }

    @DeleteMapping(DELETE_EVENT_BY_INVITEE)
    @Operation(summary = "Delete event by invitee", description = "Delete event only for the invited user")
    public ResponseEntity<ResponseDTO<Boolean>> deleteByInvitee(@RequestBody EventDeleteRequestDTO eventDeleteRequestDTO) {
        return ResponseEntity.ok(ResponseDTO.<Boolean>builder()
                .data(eventService.deleteByInvitee(eventDeleteRequestDTO))
                .code(200)
                .message("Event deleted successfully by invitee").build());
    }

    @GetMapping(FIND_ALL_BY_AUTH_ID)
    @Operation(summary = "Find all events by auth id", description = "Find all events by auth id")
    public ResponseEntity<ResponseDTO<List<EventWithStatusView>>> findAll(@RequestParam String token) {
        List<EventWithStatusView> events = eventService.findAllByAuthId(token);
        return ResponseEntity.ok(ResponseDTO.<List<EventWithStatusView>>builder()
                .data(events)
                .code(200)
                .message("Events found successfully")
                .build());
    }



    @PutMapping(UPDATE)
    @Operation(summary = "Update event by token", description = "Update event by token")
    public ResponseEntity<ResponseDTO<Boolean>> update(@RequestBody EventUpdateRequestDTO eventUpdateRequestDTO) {
        return ResponseEntity.ok(ResponseDTO.<Boolean>builder()
                .data(eventService.update(eventUpdateRequestDTO))
                .code(200)
                .message("Event updated successfully").build());
    }

    @GetMapping("/extract-auth-id")
    @Operation(summary = "Extract authId from token", description = "Extracts authId from a given token using EventService")
    public ResponseEntity<ResponseDTO<Long>> extractAuthIdFromToken(@RequestParam String token) {
        Long authId = eventService.extractAuthIdFromToken(token);
        return ResponseEntity.ok(ResponseDTO.<Long>builder()
                .data(authId)
                .code(200)
                .message("Auth ID extracted successfully")
                .build());
    }

    @PostMapping("/accept-invite")
    @Operation(summary = "Accept event invitation", description = "Accept an invitation for a specific event using token and event ID")
    public ResponseEntity<ResponseDTO<Boolean>> acceptInvite(@RequestBody EventAcceptRequestDTO dto) {
        try {
            boolean isAccepted = eventService.acceptInvite(dto);
            return ResponseEntity.ok(ResponseDTO.<Boolean>builder()
                    .data(isAccepted)
                    .code(200)
                    .message("Event invitation accepted successfully").build());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ResponseDTO.<Boolean>builder()
                    .data(false)
                    .code(500)
                    .message("Failed to accept event invitation: " + e.getMessage()).build());
        }
    }

}
