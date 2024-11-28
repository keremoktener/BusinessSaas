package com.businessapi.dto.request;

public record PageRequestDTO(
    String searchText,
    int page,
    int size)
{
}
