package com.businessapi.dto.request;

import org.springframework.web.multipart.MultipartFile;

public record SaveFileRequestDemoDTO(
        String contentType,
        MultipartFile file
) {
}
