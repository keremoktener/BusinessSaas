package com.businessapi.service;

import com.businessapi.entity.Notification;
import com.businessapi.repository.NotificationRepository;
import com.businessapi.util.JwtTokenManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final JwtTokenManager jwtTokenManager;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository, SimpMessagingTemplate messagingTemplate, JwtTokenManager jwtTokenManager) {
        this.notificationRepository = notificationRepository;
        this.messagingTemplate = messagingTemplate;
        this.jwtTokenManager = jwtTokenManager;
    }

    public void createNotification(Long authId, String title, String message) {
        Notification notification = new Notification();
        notification.setAuthId(authId);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setRead(false);
        notification.setDeleted(false);

        notificationRepository.save(notification);

        messagingTemplate.convertAndSend("/topic/create-notifications", notification);

        updateUnreadCount(authId);  // AuthId ile güncelle
    }

    public void markAsRead(String token, Long notificationId) {
        Long authId = extractAuthIdFromToken(token);

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getAuthId().equals(authId)) {
            throw new RuntimeException("You do not have permission to mark this notification as read");
        }

        notification.setRead(true);
        notificationRepository.save(notification);

        messagingTemplate.convertAndSend("/topic/markasread-notifications", notification);

        updateUnreadCount(authId);  // AuthId ile güncelle
    }

    public void deleteNotifications(String token, List<Long> notificationIds) {
        Long authId = extractAuthIdFromToken(token);

        List<Notification> notificationsToDelete = notificationRepository.findByAuthIdAndIdInAndIsDeletedFalse(authId, notificationIds);

        if (notificationsToDelete.isEmpty()) {
            throw new RuntimeException("No notifications found for the given authId and IDs: " + notificationIds);
        }

        notificationRepository.deleteAll(notificationsToDelete);

        for (Notification notification : notificationsToDelete) {
            messagingTemplate.convertAndSend("/topic/delete-notifications", notification);
        }

        updateUnreadCount(authId);  // AuthId ile güncelle
    }

    private Long extractAuthIdFromToken(String token) {
        Optional<Long> authIdOptional = jwtTokenManager.getAuthIdFromToken(token);
        if (authIdOptional.isPresent()) {
            return authIdOptional.get();
        } else {
            throw new RuntimeException("AuthId could not be extracted from token");
        }
    }

    public List<Notification> getNotificationsByToken(String token) {
        Long authId = extractAuthIdFromToken(token);
        return notificationRepository.findByAuthIdAndIsDeletedFalse(authId);
    }

    public List<Notification> getAllUnReadNotifications(String token) {
        Long authId = extractAuthIdFromToken(token);
        return notificationRepository.findByAuthIdAndIsReadFalseAndIsDeletedFalse(authId);
    }

    public long getUnreadNotificationCount(String token) {
        Long authId = extractAuthIdFromToken(token);
        return notificationRepository.countByAuthIdAndIsReadFalseAndIsDeletedFalse(authId);
    }

    private void updateUnreadCount(Long authId) {  // AuthId'yi al
        long unreadCount = notificationRepository.countByAuthIdAndIsReadFalseAndIsDeletedFalse(authId);
        messagingTemplate.convertAndSend("/topic/unreadNotifications", unreadCount);
    }
}
