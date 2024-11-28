package com.businessapi.entity;

import com.businessapi.entity.enums.EStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "tblinviteduser")
public class InvitedUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;  // Davetli kullanıcı hangi etkinliğe davet edildi

    @Column(name = "user_id")
    private Long userId;  // Davetli kullanıcının ID'si

    @Enumerated(EnumType.STRING)
    private EStatus status; // Davet durumu


}