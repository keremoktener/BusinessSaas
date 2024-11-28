package com.businessapi.dto.request;

public record CustomerSaveDTO(String firstName, String lastName, String email, String phone, String address) {
}
