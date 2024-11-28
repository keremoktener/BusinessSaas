package com.businessapi.entities;

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
@Table(name = "tblproduct")
public class Product extends BaseEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    Long memberId;
    Long supplierId;
    Long wareHouseId;
    Long productCategoryId;
    String name;
    String description;
    BigDecimal price;
    Integer stockCount;
    Integer minimumStockLevel;
    @Builder.Default
    Boolean isProductAutoOrdered= false;
    //TODO CHANGE IT TO FALSE LATER
    @Builder.Default
    Boolean isAutoOrderEnabled = true;
}
