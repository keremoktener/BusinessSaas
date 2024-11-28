package com.businessapi.services;

import com.businessapi.RabbitMQ.Model.RabbitMQNotification;
import com.businessapi.configs.RabbitMQConfig;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class RabbitMQListener {

    private final NotificationService notificationService;

    @Autowired
    public RabbitMQListener(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @RabbitListener(queues = RabbitMQConfig.NOTIFICATION_QUEUE)
    public void listen(RabbitMQNotification rabbitMQNotification) {
       saveNotifications(rabbitMQNotification);
    }

    public void saveNotifications(RabbitMQNotification rabbitMQNotification) {
        rabbitMQNotification.getAuthIds().forEach(authId -> {
            notificationService.createNotification(authId, rabbitMQNotification.getTitle(), rabbitMQNotification.getMessage());
        });
    }
}
