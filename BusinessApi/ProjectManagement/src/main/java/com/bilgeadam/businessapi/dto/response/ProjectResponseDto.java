package com.bilgeadam.businessapi.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class ProjectResponseDto {

    private Long id;
    private String name;
    //private List<Task> tasks;
}