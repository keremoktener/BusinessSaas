package com.businessapi.dto.request;

import lombok.Builder;

@Builder
public record ActivitySaveDTO(String message,
                              String type) {
}
