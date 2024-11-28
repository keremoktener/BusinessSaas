package com.businessapi.mapper;

import com.businessapi.dto.requestDTOs.RoleCreateDTO;
import com.businessapi.dto.responseDTOs.RoleResponseDTO;
import com.businessapi.entity.Role;
import com.businessapi.views.GetAllRoleView;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

import java.util.List;


@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface RoleMapper {
    RoleMapper INSTANCE = Mappers.getMapper(RoleMapper.class);


    Role roleCreateDTOToRole(RoleCreateDTO roleCreateDTO);

    RoleResponseDTO getAllRoleViewToRoleResponseDTO(GetAllRoleView getAllRoleView);


    List<RoleResponseDTO> rolesToRoleResponseDTOList(List<Role> roles);

    @Mapping(target = "roleId", source = "id")
    RoleResponseDTO roleToRoleResponseDTO(Role role);




}