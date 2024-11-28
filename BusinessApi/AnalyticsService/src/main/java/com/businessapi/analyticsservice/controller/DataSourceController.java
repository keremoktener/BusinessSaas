package com.businessapi.analyticsservice.controller;

import com.businessapi.analyticsservice.dto.request.DataSourceRequestDto;
import com.businessapi.analyticsservice.dto.response.DataSourceResponseDto;
import com.businessapi.analyticsservice.dto.response.ResponseDTO;
import com.businessapi.analyticsservice.service.DataSourceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/dev/v1/analytics/dataSources")
@CrossOrigin("*")
public class DataSourceController {

    private final DataSourceService dataSourceService;

    public DataSourceController(DataSourceService dataSourceService) {
        this.dataSourceService = dataSourceService;
    }

    @PostMapping("/fetch-and-save/{serviceType}/{endpointType}")
    public ResponseEntity<ResponseDTO<Boolean>> fetchDataAndSave(@PathVariable String serviceType, @PathVariable String endpointType) {
        dataSourceService.fetchDataAndSave(serviceType, endpointType);
        return ResponseEntity.ok(
                ResponseDTO.<Boolean>builder()
                        .data(true)
                        .message("Data fetched and saved successfully")
                        .code(200)
                        .build()
        );
    }

    @PostMapping
    public ResponseEntity<ResponseDTO<DataSourceResponseDto>> createDataSource(@RequestBody DataSourceRequestDto dataSourceRequestDto) {
        return ResponseEntity.ok(
                ResponseDTO.<DataSourceResponseDto>builder()
                        .data(dataSourceService.createDataSource(dataSourceRequestDto))
                        .message("Data source created successfully")
                        .code(200)
                        .build()
        );
    }

    @GetMapping
    public ResponseEntity<ResponseDTO<List<DataSourceResponseDto>>> getAllDataSources() {
        return ResponseEntity.ok(
                ResponseDTO.<List<DataSourceResponseDto>>builder()
                        .data(dataSourceService.getAllDataSources())
                        .message("All data sources fetched successfully")
                        .code(200)
                        .build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseDTO<DataSourceResponseDto>> getDataSourceById(@PathVariable Long id) {
        return ResponseEntity.ok(
                ResponseDTO.<DataSourceResponseDto>builder()
                        .data(dataSourceService.getDataSourceById(id))
                        .message("Data source fetched successfully")
                        .code(200)
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDTO<Boolean>> deleteDataSource(@PathVariable Long id) {
        dataSourceService.deleteDataSource(id);
        return ResponseEntity.ok(
                ResponseDTO.<Boolean>builder()
                        .data(true)
                        .message("Data source deleted successfully")
                        .code(200)
                        .build()
        );
    }
}
