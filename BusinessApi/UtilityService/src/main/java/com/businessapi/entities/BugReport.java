package com.businessapi.entities;

import com.businessapi.entities.enums.EBugStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "tblbugreport")
public class BugReport extends BaseEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    Long authId;
    String subject;
    @Column(length = 10000)
    String description;
    @Column(length = 10000)
    String adminFeedback;
    LocalDateTime resolvedAt;
    @Enumerated(EnumType.STRING)
    @Builder.Default
    EBugStatus bugStatus = EBugStatus.OPEN;
    @Builder.Default
    String version = "v1";
}
