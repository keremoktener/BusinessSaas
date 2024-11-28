package com.businessapi.analyticsservice.mapper;

import com.businessapi.analyticsservice.dto.request.ReportRequestDto;
import com.businessapi.analyticsservice.dto.response.ReportResponseDto;
import com.businessapi.analyticsservice.entity.Report;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ReportMapper {

    Report toEntity(ReportRequestDto reportRequestDto);

    ReportResponseDto toDto(Report report);

    List<ReportResponseDto> toDtoList(List<Report> reports);
}
