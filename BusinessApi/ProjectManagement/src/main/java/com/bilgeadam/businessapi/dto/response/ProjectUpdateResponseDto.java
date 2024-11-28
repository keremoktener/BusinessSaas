package com.bilgeadam.businessapi.dto.response;


import com.bilgeadam.businessapi.entity.enums.EStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class ProjectUpdateResponseDto {
    private Long id;
    private String name;
    private String description;
    private EStatus status;
}
