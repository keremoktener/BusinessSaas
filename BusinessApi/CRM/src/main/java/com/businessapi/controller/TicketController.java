package com.businessapi.controller;

import com.businessapi.dto.request.PageRequestDTO;
import com.businessapi.dto.request.TicketForCustomerSaveDTO;
import com.businessapi.dto.request.TicketSaveDTO;
import com.businessapi.dto.request.TicketUpdateDTO;
import com.businessapi.dto.response.ResponseDTO;
import com.businessapi.dto.response.TicketDetailsDTO;
import com.businessapi.entity.Ticket;
import com.businessapi.service.TicketService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.businessapi.constants.EndPoints.*;

@RestController
@RequestMapping(TICKET)
@RequiredArgsConstructor
@CrossOrigin("*")
public class TicketController {

    private final TicketService ticketService;

    @PostMapping(SAVE)
    @Operation(summary = "Save a ticket", description = "Save a ticket")
    public ResponseEntity<ResponseDTO<Boolean>> save(@RequestBody TicketSaveDTO dto) {

        return ResponseEntity.ok(ResponseDTO.<Boolean>builder()
                .data(ticketService.save(dto))
                .code(200)
                .message("Ticket saved successfully")
                .build());
    }
    @PutMapping(SAVECUSTOMER)
    @Operation(summary = "Save a customer", description = "Save a customer")
    public ResponseEntity<ResponseDTO<Boolean>> saveCustomerTicket(@RequestBody TicketForCustomerSaveDTO dto) {
        return ResponseEntity.ok(ResponseDTO.<Boolean>builder()
                .data(ticketService.saveCustomerTicket(dto))
                .code(200)
                .message("Ticket saved successfully")
                .build());
    }
    @PutMapping(UPDATE)
    @Operation(summary = "Update ticket by id",description = "Update ticket by id")
    public ResponseEntity<ResponseDTO<Boolean>> update(@RequestBody TicketUpdateDTO dto) {
        return ResponseEntity.ok(ResponseDTO.<Boolean>builder()
                .data(ticketService.update(dto))
                .code(200)
                .message("Ticket updated successfully")
                .build());
    }
    @DeleteMapping(DELETE)
    @Operation(summary = "Delete ticket",description = "Delete ticket")
    public ResponseEntity<ResponseDTO<Boolean>> delete(@RequestParam Long id) {
        return ResponseEntity.ok(ResponseDTO.<Boolean>builder()
                .data(ticketService.delete(id))
                .code(200)
                .message("Ticket deleted successfully")
                .build());
    }
    @PostMapping(FINDALL)
    @Operation(summary = "Find all tickets", description = "Find all tickets")
    public ResponseEntity<ResponseDTO<List<Ticket>>> findAll(@RequestBody PageRequestDTO dto) {
        return ResponseEntity.ok(ResponseDTO.<List<Ticket>>builder()
                .data(ticketService.findAll(dto))
                .code(200)
                .message("Tickets found successfully")
                .build());
    }
    @PostMapping(FINDBYID)
    @Operation(summary = "Find ticket by id",description = "Find ticket by id")
    public ResponseEntity<ResponseDTO<Ticket>> findById(@RequestParam Long id) {
        return ResponseEntity.ok(ResponseDTO.<Ticket>builder()
                .data(ticketService.findById(id))
                .code(200)
                .message("Ticket found successfully")
                .build());
    }
    @PostMapping(GETDETAILS)
    @Operation(summary = "Get details by id", description = "Get details by id")
    public ResponseEntity<ResponseDTO<TicketDetailsDTO>> getDetails(@RequestParam Long id) {
        return ResponseEntity.ok(ResponseDTO.<TicketDetailsDTO>builder()
                .data(ticketService.getDetails(id))
                .code(200)
                .message("Ticket found successfully")
                .build());
    }
}
