package com.businessapi.dto.response;

import com.businessapi.dto.request.CustomerDetailsDTO;
import lombok.Builder;

import java.util.List;

@Builder
public record OpportunityDetailsDTO(String name,
                                    String description,
                                    Double value,
                                    String stage,
                                    Double probability,
                                    List<CustomerDetailsDTO> customers
                                 ) {
}
