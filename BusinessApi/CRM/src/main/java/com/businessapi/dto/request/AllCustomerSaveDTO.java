package com.businessapi.dto.request;


import lombok.Builder;

import java.util.List;
@Builder
public record AllCustomerSaveDTO(List<CustomerSaveDTO> customers) {
}
