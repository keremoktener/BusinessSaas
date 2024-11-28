package com.businessapi.analyticsservice.mapper;

import com.businessapi.analyticsservice.dto.request.DataSourceRequestDto;
import com.businessapi.analyticsservice.dto.response.DataSourceResponseDto;
import com.businessapi.analyticsservice.entity.DataSource;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface DataSourceMapper {

    DataSource toEntity(DataSourceRequestDto dataSourceRequestDto);

    DataSourceResponseDto toDto(DataSource dataSource);

    List<DataSourceResponseDto> toDtoList(List<DataSource> dataSources);
}

