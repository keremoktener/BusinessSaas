package com.businessapi.dto.request;

import java.math.BigDecimal;

public record ProductUpdateRequestDTO(Long id,
                                      Long supplierId,
                                      Long wareHouseId,
                                      Long productCategoryId,
                                      String name,
                                      String description,
                                      BigDecimal price,
                                      Integer stockCount,
                                      Integer minimumStockLevel)
{
}
