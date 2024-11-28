package com.businessapi.repository;

import com.businessapi.entity.Event;
import com.businessapi.entity.InvitedUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvitedUserRepository extends JpaRepository<InvitedUser, Long> {
    List<InvitedUser> findAllByUserId(Long authId);
    void deleteByEventId(Long eventId);

    // Etkinlik ve kullanıcı kimliğine göre davetli kullanıcıyı bul
    Optional<InvitedUser> findByEventAndUserId(Event event, Long userId);
}