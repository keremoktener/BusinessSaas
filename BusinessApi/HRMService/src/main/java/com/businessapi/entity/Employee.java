package com.businessapi.entity;

import com.businessapi.utility.enums.EStatus;
import com.rabbitmq.tools.json.JSONUtil;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
@Entity
@Table(name = "tblemployee")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long memberId;
    private String firstName;
    private String lastName;
    private String position;
    private String department;
    private String email;
    private String phone;
    private LocalDate birthDate;
    private String gender;
    private LocalDate hireDate;
    private Double salary;
    @Enumerated(EnumType.STRING)
    private EStatus status;

}