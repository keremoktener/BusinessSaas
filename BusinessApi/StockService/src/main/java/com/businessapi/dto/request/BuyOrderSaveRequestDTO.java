package com.businessapi.dto.request;

public record BuyOrderSaveRequestDTO(Long supplierId,
                                     Long productId,
                                     Integer quantity

                                  )

{
}
