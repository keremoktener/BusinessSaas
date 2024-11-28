package com.businessapi.analyticsservice.entity.stockService.entity;

import com.businessapi.analyticsservice.entity.stockService.enums.EStockMovementType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class StockMovement {
    private Long id;
    private Long productId;
    private Long warehouseId;
    private Integer quantity;
    private String status;

    @Enumerated(EnumType.STRING)
    private EStockMovementType stockMovementType;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

