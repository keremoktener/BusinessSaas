package com.businessapi.dto.response;

import java.time.LocalDateTime;

public record FindAllResponseDTO (String id,
                                 String title,
                                 LocalDateTime startTime,
                                 LocalDateTime endTime
                                 ){
}
