package com.businessapi.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class OrganizationDataDTO {
    Long id;
    String image;
    String name;
    String title;
    String department;
    String email;


}