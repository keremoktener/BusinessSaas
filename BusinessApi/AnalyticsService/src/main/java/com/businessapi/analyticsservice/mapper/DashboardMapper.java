package com.businessapi.analyticsservice.mapper;

import com.businessapi.analyticsservice.dto.request.DashboardRequestDto;
import com.businessapi.analyticsservice.dto.response.DashboardResponseDto;
import com.businessapi.analyticsservice.entity.Dashboard;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface DashboardMapper {
    Dashboard toEntity(DashboardRequestDto dto);
    DashboardResponseDto toDto(Dashboard dashboard);
    List<DashboardResponseDto> toDtoList(List<Dashboard> dashboards);
}
