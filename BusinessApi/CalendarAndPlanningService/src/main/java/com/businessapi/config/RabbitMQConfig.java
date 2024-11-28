package com.businessapi.config;

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
public class RabbitMQConfig {

    private final String businessDirectExchange = "businessDirectExchange";

    private static final String queueGetUserIdByToken = "queueGetUserIdByToken";
    private static final String keyGetUserIdByToken = "keyGetUserIdByToken";

    @Bean
    public DirectExchange businessDirectExchange() {
        return new DirectExchange(businessDirectExchange);
    }


    @Bean
    public Queue queueGetUserIdByToken() {
        return new Queue(queueGetUserIdByToken);
    }

    @Bean
    public Binding bindingGetUserIdByToken (Queue queueGetUserIdByToken, DirectExchange businessDirectExchange) {
        return BindingBuilder.bind(queueGetUserIdByToken).to(businessDirectExchange).with(keyGetUserIdByToken);
    }


    @Bean
    MessageConverter messageConverter(){
        return new Jackson2JsonMessageConverter();
    }



    RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory){
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(messageConverter());
        return rabbitTemplate;
    }
}
