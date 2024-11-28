package com.businessapi.views;

import com.businessapi.entity.enums.EStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class GetAllRoleView {
    private Long roleId;
    private String roleName;
    private EStatus status;
    private String roleDescription;
}
