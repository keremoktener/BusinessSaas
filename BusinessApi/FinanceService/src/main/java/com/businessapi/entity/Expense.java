package com.businessapi.entity;


import com.businessapi.entity.enums.EExpenseCategory;
import com.businessapi.entity.enums.EStatus;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;

@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "tblexpense")
public class Expense extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    Long memberId;

    @Enumerated(EnumType.STRING)
    EExpenseCategory expenseCategory;

    LocalDate expenseDate;
    BigDecimal amount;
    String description;

    @ManyToOne
    @JoinColumn(name = "department_id")
    @JsonBackReference
    Department department;
}
