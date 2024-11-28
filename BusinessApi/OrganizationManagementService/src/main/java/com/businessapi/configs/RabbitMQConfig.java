package com.businessapi.configs;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class RabbitMQConfig
{
    //TODO QUEUES WILL CHANGE LATER
    String directExchange="businessDirectExchange";
    String queueFindAuthByToken = "find.auth.by.token";
    String keyFindAuthByToken = "key.find.auth.by.token";
    String queueGetModelFromOrganizationManagementService = "queueGetModelFromOrganizationManagementService";
    String keyGetModelFromOrganizationManagementService = "keyGetModelFromOrganizationManagementService";
    String queueRequestDataFromOrganizationManagementService = "queueRequestDataFromOrganizationManagementService";
    String keyRequestDataFromOrganizationManagementService = "keyRequestDataFromOrganizationManagementService";

    @Bean
    public DirectExchange directExchange(){
        return new DirectExchange(directExchange);
    }


    @Bean
    public Queue queueFindAuthByToken(){
        return new Queue(queueFindAuthByToken);
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
    public Binding bindingGetModelFromOrganizationManagementService(Queue queueGetModelFromOrganizationManagementService, DirectExchange directExchange){
        return BindingBuilder.bind(queueGetModelFromOrganizationManagementService).to(directExchange).with(keyGetModelFromOrganizationManagementService);
    }

    @Bean
    public Binding bindingRequestDataFromOrganizationManagementService(Queue queueRequestDataFromOrganizationManagementService, DirectExchange directExchange){
        return BindingBuilder.bind(queueRequestDataFromOrganizationManagementService).to(directExchange).with(keyRequestDataFromOrganizationManagementService);
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
    RabbitTemplate rabbitTemplate(ConnectionFactory factory){
        RabbitTemplate rabbitTemplate = new RabbitTemplate(factory);
        rabbitTemplate.setMessageConverter(messageConverter());
        return rabbitTemplate;
    }
}
