package com.businessapi.dto.request;

public record OpportunitySaveDemoDTO(Long customerId, String name, String description, Double value, String stage, Double probability) {
}
