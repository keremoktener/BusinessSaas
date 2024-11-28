package com.businessapi.entities;

import com.businessapi.entities.enums.EOrderType;
import com.businessapi.exception.ErrorType;
import com.businessapi.exception.StockServiceException;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "tblorder")
public class Order extends BaseEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    Long memberId;

    // Customer id should be set for buy order
    Long customerId;

    // Supplier id should be set for buy order
    Long supplierId;


    Long productId;
    Integer quantity;
    BigDecimal unitPrice;
    BigDecimal total;
    @Enumerated(EnumType.STRING)
    EOrderType orderType;

    @PrePersist
    @PreUpdate
    public void calculateTotalPrice() {
        // Calculation of Total Price
        if (unitPrice != null && quantity != null) {
            total = unitPrice.multiply(BigDecimal.valueOf(quantity));
        }
        // Buy Orders Id Check
        if (orderType == EOrderType.BUY) {
            if (supplierId == null) {
                throw new StockServiceException(ErrorType.INCORRECT_BUY_ORDER_TYPE);
            }
            if (customerId != null) {
                throw new StockServiceException(ErrorType.INCORRECT_BUY_ORDER_TYPE);
            }
        }
        // Sell Orders Id Check
        else if (orderType == EOrderType.SELL) {
            if (customerId == null) {
                throw new StockServiceException(ErrorType.INCORRECT_SELL_ORDER_TYPE);
            }
            if (supplierId != null) {
                throw new StockServiceException(ErrorType.INCORRECT_SELL_ORDER_TYPE);
            }
        }
    }




}
