package com.businessapi.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class OrganizationNodeDTO {
    String type;
    OrganizationDataDTO data;
    List<OrganizationNodeDTO> children;
    boolean expanded;

}