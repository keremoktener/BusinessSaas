package com.businessapi.config.rabbit.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class EmailVerificationModel {
    private Long authId;
    private String email;
    private String firstName;
    private String lastName;
}
