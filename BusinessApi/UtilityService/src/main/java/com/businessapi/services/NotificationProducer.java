package com.businessapi.services;

import com.businessapi.RabbitMQ.Model.RabbitMQNotification;
import com.businessapi.configs.RabbitMQConfig;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class NotificationProducer {

    private final RabbitTemplate rabbitTemplate;

    @Autowired
    public NotificationProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendNotification(Long userId, String title, String message) {
        List<Long> userIdsList = new ArrayList<>();
        userIdsList.add(userId);
        RabbitMQNotification notification = RabbitMQNotification.builder()
                .authIds(userIdsList)
                .title(title)
                .message(message)
                .build();

        rabbitTemplate.convertAndSend(RabbitMQConfig.NOTIFICATION_EXCHANGE,
                RabbitMQConfig.NOTIFICATION_ROUTING_KEY,
                notification);
    }
}
