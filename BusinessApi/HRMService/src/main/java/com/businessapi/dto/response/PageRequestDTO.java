package com.businessapi.dto.response;

public record PageRequestDTO(
    String searchText,
    int page,
    int size
   )
{
}
