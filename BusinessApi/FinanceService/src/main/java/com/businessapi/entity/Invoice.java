package com.businessapi.entity;

import com.businessapi.entity.enums.EInvoiceStatus;
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
@Table(name = "tblinvoice")
public class Invoice extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    Long memberId;
    String buyerTcNo;
    String buyerEmail;
    String buyerPhone;
    Long productId;
    String productName;
    Integer quantity;
    LocalDate invoiceDate;
    BigDecimal totalAmount;
    BigDecimal unitPrice;
}
