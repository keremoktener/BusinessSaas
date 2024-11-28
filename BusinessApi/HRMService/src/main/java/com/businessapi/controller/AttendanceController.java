package com.businessapi.controller;

import com.businessapi.dto.request.AttendanceSaveRequestDTO;
import com.businessapi.dto.request.AttendanceUpdateRequestDTO;
import com.businessapi.dto.request.EmployeeSaveRequestDTO;
import com.businessapi.dto.request.EmployeeUpdateRequestDTO;
import com.businessapi.dto.response.AttendanceResponseDTO;
import com.businessapi.dto.response.EmployeeResponseDTO;
import com.businessapi.dto.response.PageRequestDTO;
import com.businessapi.dto.response.ResponseDTO;
import com.businessapi.entity.Attendance;
import com.businessapi.service.AttendanceService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.businessapi.constants.EndPoints.*;

@RestController
@RequestMapping(ATTENDANCE)
@RequiredArgsConstructor
@CrossOrigin(origins = "*", methods = {RequestMethod.POST, RequestMethod.GET, RequestMethod.PUT,RequestMethod.DELETE})
public class AttendanceController {
    private  final AttendanceService attendanceService;

    @PostMapping(SAVE)
    @Operation(summary = "Creates new Attendance")
    public ResponseEntity<ResponseDTO<Boolean>> save(@RequestBody AttendanceSaveRequestDTO dto){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(attendanceService.save(dto))
                .message("Success")
                .code(200)
                .build());
    }
    @PutMapping(UPDATE)
    @Operation(summary = "Update Attendance")
    public ResponseEntity<ResponseDTO<Boolean>> update(@RequestBody AttendanceUpdateRequestDTO dto){

        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(attendanceService.update(dto))
                .message("Success")
                .code(200)
                .build());
    }
    @PostMapping (FIND_BY_ID)
    @Operation(summary = "Find Attendance by id")
    public ResponseEntity<ResponseDTO<AttendanceResponseDTO>> findById(@RequestParam Long id){

        return ResponseEntity.ok(ResponseDTO
                .<AttendanceResponseDTO>builder()
                .data(attendanceService.findById(id))
                .message("Success")
                .code(200)
                .build());
    }
    @PostMapping (FIND_ALL)
    @Operation(summary = "Find all Attendance ")
    public ResponseEntity<ResponseDTO<List<AttendanceResponseDTO>>> findAll(@RequestBody PageRequestDTO dto){

        return ResponseEntity.ok(ResponseDTO
                .<List<AttendanceResponseDTO>>builder()
                .data(attendanceService.findAll(dto))
                .message("Success")
                .code(200)
                .build());
    }
    @DeleteMapping(DELETE)
    @Operation(summary = "Delete Attendance by id")
    public ResponseEntity<ResponseDTO<Boolean>> delete(@RequestParam Long id){
        return ResponseEntity.ok(ResponseDTO
                .<Boolean>builder()
                .data(attendanceService.delete(id))
                .message("Success")
                .code(200)
                .build());
    }
}
