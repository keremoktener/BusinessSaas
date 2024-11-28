package com.businessapi.entity;
import com.businessapi.utilty.enums.EContentType;
import com.businessapi.utilty.enums.EStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Data
@Entity
@Table(name = "tblfiles")

public class File extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
   private   Long id;
    private Long authId;
    private String uuid;
    @Builder.Default
    @Enumerated(EnumType.STRING)
    EStatus status = EStatus.ACTIVE;
    @Enumerated(EnumType.STRING)
    EContentType contentType ;


}
