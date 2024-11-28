package com.businessapi.entity;

import com.businessapi.utility.enums.EStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Data
@Entity
@Table(name = "tblopportunity")
@EqualsAndHashCode(callSuper = true)
public class Opportunity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    private Long memberId;
    @ManyToMany
    @JoinTable(
            name = "opportunity_customer",
            joinColumns = @JoinColumn(name = "opportunity_id"),
            inverseJoinColumns = @JoinColumn(name = "customer_id"),
            uniqueConstraints = @UniqueConstraint(columnNames = {"opportunity_id", "customer_id"})
    )
    @JsonManagedReference
    private List<Customer> customers = new ArrayList<>();
    private String name;
    private String description;
    private Double value;
    private String stage;
    private Double probability;
    @Enumerated(EnumType.STRING)
    EStatus status;
}
