package com.businessapi.dto.requestDTOs;

public record PageRequestDTO(
    String searchText,
    int page,
    int size)
{
}
