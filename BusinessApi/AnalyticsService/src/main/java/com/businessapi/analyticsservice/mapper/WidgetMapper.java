package com.businessapi.analyticsservice.mapper;

import com.businessapi.analyticsservice.dto.request.WidgetRequestDto;
import com.businessapi.analyticsservice.dto.response.WidgetResponseDto;
import com.businessapi.analyticsservice.entity.Widget;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface WidgetMapper {

    Widget toEntity(WidgetRequestDto widgetRequestDto);

    WidgetResponseDto toDto(Widget widget);

    List<WidgetResponseDto> toDtoList(List<Widget> widgets);
}

