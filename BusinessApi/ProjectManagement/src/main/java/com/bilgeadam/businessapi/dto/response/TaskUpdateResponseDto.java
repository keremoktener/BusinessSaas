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
@Data //@getters, @setters kullansan daha iyi
public class TaskUpdateResponseDto {
    private Long id;
    private String name;
    private String description;
    private EStatus status;
    private Long assignedUserId;
    private EPriority priority;

}
