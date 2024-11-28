package com.businessapi.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class RabbitMQConfig
{
    String directExchange="businessDirectExchange";
    String queueFindAuthByToken = "find.auth.by.token";
    String keyFindAuthByToken = "key.find.auth.by.token";
    public static final String NOTIFICATION_QUEUE = "notificationQueue";
    public static final String NOTIFICATION_EXCHANGE = "notificationExchange";
    public static final String NOTIFICATION_ROUTING_KEY = "notificationKey";

    private final String queueSendStyledEmail = "queueSendStyledEmail";
    private final String keySendStyledEmail = "keySendStyledEmail";

    ////////////////////////////////
    @Bean
    public DirectExchange directExchange(){
        return new DirectExchange(directExchange);
    }
    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(NOTIFICATION_EXCHANGE);
    }

    ////////////////////////////////
    @Bean
    public Queue queueFindAuthByToken(){
        return new Queue(queueFindAuthByToken);
    }
    @Bean
    public Queue queue() {
        return new Queue(NOTIFICATION_QUEUE, false);
    }
    @Bean
    public Queue queueSendStyledEmail(){
        return new Queue(queueSendStyledEmail);
    }

    ////////////////////////////////
    @Bean
    public Binding bindingSaveDirectExchange(Queue queueFindAuthByToken, DirectExchange directExchange){
        return BindingBuilder.bind(queueFindAuthByToken).to(directExchange).with(keyFindAuthByToken);
    }
    @Bean
    public Binding binding(Queue queue, TopicExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with(NOTIFICATION_ROUTING_KEY);
    }
    @Bean
    public Binding bindingKeySendStyledEmail(){
        return BindingBuilder.bind(queueSendStyledEmail()).to(directExchange()).with(keySendStyledEmail);
    }

    ////////////////////////////////
    @Bean
    MessageConverter messageConverter(){
        return new Jackson2JsonMessageConverter();
    }
    @Bean
    RabbitTemplate rabbitTemplate(ConnectionFactory factory){
        RabbitTemplate rabbitTemplate = new RabbitTemplate(factory);
        rabbitTemplate.setMessageConverter(messageConverter());
        return rabbitTemplate;
    }
}
