package com.businessapi.entity;

import com.businessapi.entity.enums.EBudgetCategory;
import com.fasterxml.jackson.annotation.JsonBackReference;
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
@Table(name = "tblbudget")
public class Budget extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    Long memberId;

    @Builder.Default
    BigDecimal totalAmount = new BigDecimal(0);

    BigDecimal subAmount;

    @Builder.Default
    BigDecimal spentAmount = new BigDecimal(0);

    @Enumerated(EnumType.STRING)
    EBudgetCategory budgetCategory;

    String description;

    @ManyToOne
    @JoinColumn(name = "department_id")
    @JsonBackReference
    Department department;
}
