package com.businessapi.configs;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    String directExchange = "businessDirectExchange";
    String notificationExchange = "notificationExchange";
    String queueFindAuthByToken = "find.auth.by.token";
    String keyFindAuthByToken = "key.find.auth.by.token";
    String queueGetModelFromStockService = "queueGetModelFromStockService";
    String keyGetModelFromStockService = "keyGetModelFromStockService";
    String queueGetModelFromOrganizationManagementService = "queueGetModelFromOrganizationManagementService";
    String keyGetModelFromOrganizationManagementService = "keyGetModelFromOrganizationManagementService";
    String queueRequestDataFromOrganizationManagementService = "queueRequestDataFromOrganizationManagementService";
    String keyRequestDataFromOrganizationManagementService = "keyRequestDataFromOrganizationManagementService";
    String notificationQueue = "notificationQueue";
    String notificationRoutingKey = "notificationKey";

    @Bean
    public DirectExchange directExchange(){
        return new DirectExchange(directExchange);
    }

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(notificationExchange);
    }

    @Bean
    public Queue queueGetModelFromStockService(){
        return new Queue(queueGetModelFromStockService);
    }

    @Bean
    public Queue queueGetModelFromOrganizationManagementService(){
        return new Queue(queueGetModelFromOrganizationManagementService);
    }

    @Bean
    public Queue queueRequestDataFromOrganizationManagementService(){
        return new Queue(queueRequestDataFromOrganizationManagementService);
    }

    @Bean
    public Queue queue() {
        return new Queue(notificationQueue, false);
    }

    @Bean
    public Binding bindingGetModelFromStockService(Queue queueGetModelFromStockService, DirectExchange directExchange){
        return BindingBuilder.bind(queueGetModelFromStockService).to(directExchange).with(keyGetModelFromStockService);
    }

    @Bean
    public Binding bindingGetModelFromOrganizationManagementService(Queue queueGetModelFromOrganizationManagementService, DirectExchange directExchange){
        return BindingBuilder.bind(queueGetModelFromOrganizationManagementService).to(directExchange).with(keyGetModelFromOrganizationManagementService);
    }

    @Bean
    public Binding bindingRequestDataFromOrganizationManagementService(Queue queueRequestDataFromOrganizationManagementService, DirectExchange directExchange){
        return BindingBuilder.bind(queueRequestDataFromOrganizationManagementService).to(directExchange).with(keyRequestDataFromOrganizationManagementService);
    }

    @Bean
    public Binding binding(Queue queue, TopicExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with(notificationRoutingKey);
    }

    @Bean
    public Queue queueFindAuthByToken() {
        return new Queue(queueFindAuthByToken);
    }

    @Bean
    public Binding bindingSaveDirectExchange(Queue queueFindAuthByToken, DirectExchange directExchange){
        return BindingBuilder.bind(queueFindAuthByToken).to(directExchange).with(keyFindAuthByToken);
    }

    @Bean
    MessageConverter messageConverter(){
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory){
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(messageConverter());
        return rabbitTemplate;
    }
}
