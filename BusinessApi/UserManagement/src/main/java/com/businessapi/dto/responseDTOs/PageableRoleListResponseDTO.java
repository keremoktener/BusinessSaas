package com.businessapi.dto.responseDTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class PageableRoleListResponseDTO {
    private List<RoleResponseDTO> roleList;
    private long totalElements;
    private int totalPages;
    private int currentPage;
}
