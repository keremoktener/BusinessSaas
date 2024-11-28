package com.businessapi.entity;

import com.businessapi.utility.enums.EStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.hibernate.validator.constraints.UUID;

import java.time.LocalDate;
import java.time.LocalDateTime;


@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Data
@Entity
@Table(name = "tblactivities")
public class Activities {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String uuid;
    private Long memberId;
    private String message;
    private String type; // INFO, ERROR, WARN vb.
    private String code;
    private LocalDateTime date = LocalDateTime.now();
}
