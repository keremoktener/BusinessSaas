package com.businessapi.config.rabbit.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class CustomerSendEmailAboutOpportunity {
    String firstName;
    String lastName;
    String email;
    String title;
    String description;
    Double value;
}
