package com.businessapi.mapper;

import com.businessapi.dto.request.CustomerSaveDTO;
import com.businessapi.dto.response.CustomerResponseDTO;
import com.businessapi.entity.Customer;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring",unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CustomerMapper {

    CustomerMapper INSTANCE = Mappers.getMapper(CustomerMapper.class);

    Customer customerSaveDTOToCustomer(CustomerSaveDTO customerSaveDTO);


    List<CustomerResponseDTO> customersToCustomerResponseDTOs(List<Customer> customers);



    CustomerResponseDTO customerToCustomerResponseDTO(Customer customer);


}








