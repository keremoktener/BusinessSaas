package com.businessapi.dto.responseDTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class GetUserInformationDTO {
    private Long id;
    private Long authId;
    private String firstName;
    private String lastName;
    private String email;
}
