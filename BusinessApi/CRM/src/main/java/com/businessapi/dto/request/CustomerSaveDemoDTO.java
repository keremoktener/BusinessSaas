package com.businessapi.dto.request;

import com.businessapi.utility.enums.EStatus;

public record CustomerSaveDemoDTO(String firstName, String lastName, String email, String phone, String address , EStatus status) {
}
