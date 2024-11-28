package com.bilgeadam.businessapi.dto.response;

import com.bilgeadam.businessapi.entity.enums.EPriority;
import com.bilgeadam.businessapi.entity.enums.EStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class TaskSaveResponseDTO{
    private Long id;
    private String name;
    private String description;
    private Long assignedUserId;
    private EPriority priority;
    private EStatus status;
    //private List<EResources> resources;
    private Long projectId;
}





