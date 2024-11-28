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
public class PageableUserListResponseDTO {
    private List<GetAllUsersResponseDTO> userList;
    private long totalElements;
    private int totalPages;
    private int currentPage;
}
