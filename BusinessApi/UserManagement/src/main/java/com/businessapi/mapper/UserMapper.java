package com.businessapi.mapper;

import com.businessapi.RabbitMQ.Model.SaveUserFromOtherServicesModel;
import com.businessapi.dto.requestDTOs.UserSaveRequestDTO;
import com.businessapi.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;


@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);


    @Mapping(target = "role",ignore = true)
    User userSaveRequestDTOToUser(UserSaveRequestDTO userSaveRequestDTO);

    @Mapping(target = "role",ignore = true)
    User saveUserFromOtherServicesToUser(SaveUserFromOtherServicesModel saveUserFromOtherServicesModel);



}