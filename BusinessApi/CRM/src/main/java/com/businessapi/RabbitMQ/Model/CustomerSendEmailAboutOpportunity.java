package com.businessapi.RabbitMQ.Model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

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
