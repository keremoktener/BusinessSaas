package com.businessapi.controller;

import static com.businessapi.constants.EndPoints.*;

import com.businessapi.dto.request.NotificationRequestDto;
import com.businessapi.entity.Notification;
import com.businessapi.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(NOTIFICATIONS)
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping(CREATE_NOTIFICATION)
    @MessageMapping("/notifications/create")
    @SendTo("/topic/create-notifications")
    public ResponseEntity<Void> createNotification(@RequestBody NotificationRequestDto dto) {
        notificationService.createNotification(dto.getAuthId(), dto.getTitle(), dto.getMessage());
        return ResponseEntity.ok().build();
    }

    @GetMapping(GET_ALL_NOTIFICATIONS_FOR_AUTHID)
    public ResponseEntity<List<Notification>> getNotifications(@RequestParam String token) {
        List<Notification> notifications = notificationService.getNotificationsByToken(token);
        return ResponseEntity.ok(notifications);
    }


    @GetMapping(GET_ALL_UNREAD_NOTIFICATIONS_FOR_AUTHID)
    public ResponseEntity<List<Notification>> getAllUnReadNotifications(@RequestParam String token) {
        List<Notification> notifications = notificationService.getAllUnReadNotifications(token);
        return ResponseEntity.ok(notifications);
    }
    @GetMapping(GET_UNREAD_COUNT)
    @MessageMapping("/notifications/unreadcount")
    @SendTo("/topic/unreadcountNotifications")
    public ResponseEntity<Long> getUnreadNotificationCount(@RequestParam String token) {
        long unreadCount = notificationService.getUnreadNotificationCount(token);
        return ResponseEntity.ok(unreadCount);
    }



    @PatchMapping(READ)
    @MessageMapping("/notifications/markasread")
    @SendTo("/topic/markasread-notifications")
    public ResponseEntity<Void> markAsRead(@RequestParam String token, @RequestParam Long notificationId) {
        notificationService.markAsRead(token, notificationId);
        return ResponseEntity.noContent().build();
    }


    @DeleteMapping(DELETE)
    @MessageMapping("/notifications/delete")
    @SendTo("/topic/delete-notifications")
    public ResponseEntity<Void> deleteNotifications(@RequestParam String token, @RequestBody List<Long> notificationIds) {
        notificationService.deleteNotifications(token, notificationIds);
        return ResponseEntity.noContent().build();
    }


}
