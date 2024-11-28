package com.businessapi.entity;

import com.businessapi.entity.enums.ERoles;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tblplans")
public class Plan extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    private Double price;

    @ElementCollection
    @Enumerated(EnumType.STRING)
    private List<ERoles> roles;

    @OneToMany(fetch = FetchType.EAGER)
    private List<PlanTranslation> translations;

    public PlanTranslation getPlanTranslationByLanguage(String language) {
        return translations.stream().filter(t -> t.getLanguage().equals(language)).findFirst().orElse(null);
    }
}
