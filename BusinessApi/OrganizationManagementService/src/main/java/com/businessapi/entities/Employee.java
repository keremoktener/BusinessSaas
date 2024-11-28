package com.businessapi.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "tblemployee")
public class Employee extends BaseEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    Long memberId;
    Long authId;
    @ManyToOne
    Employee manager;
    @ManyToOne
    Department department;
    @OneToMany(cascade = CascadeType.ALL)
    List<Employee> subordinates;
    String identityNo;
    String title;
    String phoneNo;
    String name;
    String surname;
    String email;
    @Builder.Default
    Boolean isEmployeeTopLevelManager = false;
    @Builder.Default
    Boolean isAccountGivenToEmployee = false;
}
