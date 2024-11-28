package com.businessapi.dto.request;

import com.businessapi.utilty.enums.EContentType;
import org.springframework.web.multipart.MultipartFile;

public record SaveFileRequestDTO(
        String contentType,
        MultipartFile file,
        String token
) {
}
