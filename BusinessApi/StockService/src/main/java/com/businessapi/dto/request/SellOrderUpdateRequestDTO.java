package com.businessapi.dto.request;

public record SellOrderUpdateRequestDTO(
        Long id,
        Long customerId,
        Long productId,
        Integer quantity
)
{
}
