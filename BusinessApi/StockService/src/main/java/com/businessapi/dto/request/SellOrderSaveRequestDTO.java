package com.businessapi.dto.request;

public record SellOrderSaveRequestDTO(Long customerId,
                                      Long productId,
                                      Integer quantity

                                  )

{
}
