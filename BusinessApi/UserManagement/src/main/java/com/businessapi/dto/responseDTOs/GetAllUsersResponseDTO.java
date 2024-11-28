package com.businessapi.dto.responseDTOs;

import com.businessapi.entity.enums.EStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class GetAllUsersResponseDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private EStatus status;
    private String email;
    private List<String> userRoles;
}
