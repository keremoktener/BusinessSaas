package com.businessapi.controller;


import com.businessapi.dto.request.PassCardSaveRequestDTO;

import com.businessapi.dto.response.ResponseDTO;
import com.businessapi.entity.PassCard;

import com.businessapi.service.PassCardService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.businessapi.constants.EndPoints.*;

@RestController
@RequestMapping(PASSCARD)
@RequiredArgsConstructor
@CrossOrigin(origins = "*", methods = {RequestMethod.POST, RequestMethod.GET, RequestMethod.PUT,RequestMethod.DELETE})
public class PassCardController {
    private  final PassCardService passCardService;

    @PostMapping(SAVE)
    @Operation(summary = "Creates new Pass Card")
    public ResponseEntity<ResponseDTO<Boolean>> save(@RequestBody PassCardSaveRequestDTO dto){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(passCardService.save(dto))
                .message("Success")
                .code(200)
                .build());
    }


    @PostMapping (FIND_ALL)
    @Operation(summary = "Find all Pass Card ")
    public ResponseEntity<ResponseDTO<List<PassCard>>> findAll(){

        return ResponseEntity.ok(ResponseDTO
                .<List<PassCard>>builder()
                .data(passCardService.findAll())
                .message("Success")
                .code(200)
                .build());
    }
    @DeleteMapping(DELETE)
    @Operation(summary = "Delete Pass Card by id")
    public ResponseEntity<ResponseDTO<Boolean>> delete(@RequestParam Long id){
        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(passCardService.delete(id))
                .message("Success")
                .code(200)
                .build());
    }
    @PostMapping(CHECK_IN_TIME)
    @Operation(summary = "Check in time")
    public ResponseEntity<ResponseDTO<Boolean>> checkInTime(@RequestParam String cardNumber){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(passCardService.checkInTime(cardNumber))
                .message("Success")
                .code(200)
                .build());
    }

    @PostMapping(CHECK_OUT_TIME)
    @Operation(summary = "Check out time")
    public ResponseEntity<ResponseDTO<Boolean>> checkOutTime(@RequestParam String cardNumber){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(passCardService.checkOutTime(cardNumber))
                .message("Success")
                .code(200)
                .build());
    }
}
