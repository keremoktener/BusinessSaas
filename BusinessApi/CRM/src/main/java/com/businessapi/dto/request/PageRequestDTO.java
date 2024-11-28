package com.businessapi.dto.request;

import jakarta.validation.constraints.NotNull;

public record PageRequestDTO(
    String searchText,
    int page,
    int size
   )
{
}
