package com.businessapi.entity;

import com.businessapi.utility.enums.EStatus;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Data
@Entity
@Table(name = "tblticket")
public class Ticket extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    private Long memberId;
    @ManyToMany
    @JoinTable(
            name = "ticket_customer",
            joinColumns = @JoinColumn(name = "ticket_id"),
            inverseJoinColumns = @JoinColumn(name = "customer_id")
    )
    @JsonManagedReference
    private List<Customer> customers = new ArrayList<>();
    private String subject;
    private String description;
    private String ticketStatus;
    private String priority;
    private LocalDate createdDate;
    private LocalDate closedDate;
    @Enumerated(EnumType.STRING)
    EStatus status;
}
