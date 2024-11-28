package com.businessapi.dto.request;

public record CustomerUpdateDTO(Long id, String firstName, String lastName, String email, String phone, String address) {
}
