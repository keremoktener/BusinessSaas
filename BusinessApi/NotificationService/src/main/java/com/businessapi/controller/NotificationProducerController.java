package com.businessapi.controller;

import com.businessapi.dto.request.NotificationRequestDto;
import com.businessapi.service.NotificationProducer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notify")
public class NotificationProducerController {

    private final NotificationProducer notificationProducer;

    @Autowired
    public NotificationProducerController(NotificationProducer notificationProducer) {
        this.notificationProducer = notificationProducer;
    }

    @PostMapping
    public ResponseEntity<Void> sendNotification(@RequestBody NotificationRequestDto dto) {
        notificationProducer.sendNotification(dto.getAuthId(), dto.getTitle(),dto.getMessage());
        return ResponseEntity.ok().build();
    }
}
