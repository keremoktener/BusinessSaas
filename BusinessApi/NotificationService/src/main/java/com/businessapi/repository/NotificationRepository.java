package com.businessapi.repository;

import com.businessapi.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByAuthIdAndIsDeletedFalse(Long authId);

    List<Notification> findByAuthIdAndIdInAndIsDeletedFalse(Long authId, List<Long> ids);

    List<Notification> findByAuthIdAndIsReadFalseAndIsDeletedFalse(Long authId);

    long countByAuthIdAndIsReadFalseAndIsDeletedFalse(Long authId);
}
