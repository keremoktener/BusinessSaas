package com.bilgeadam.businessapi.mapper;

import com.bilgeadam.businessapi.dto.response.ProjectResponseDto;
import com.bilgeadam.businessapi.entity.Project;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
//import org.mapstruct.factory.Mappers;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProjectMapper {
    ProjectMapper INSTANCE = Mappers.getMapper(ProjectMapper.class );

    List<ProjectResponseDto> projectToProjectFindAllResponseDto(List<Project> project);

}



