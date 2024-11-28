package com.businessapi.entities;

import com.businessapi.entities.enums.EStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.SuperBuilder;


@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "tblfeedback")
public class Feedback extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
     private    Long id;
    private Long authId;
    @Column(length = 10000)
    private String description;
    @Size(min = 1,max = 5, message = "Rating must be between 1 and 5")
    private Integer rating;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    EStatus status = EStatus.ACTIVE;
}
