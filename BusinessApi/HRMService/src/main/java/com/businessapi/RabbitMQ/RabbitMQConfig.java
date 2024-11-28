package com.businessapi.RabbitMQ;


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

    String queueFindAuthByToken = "find.auth.by.token";
    String keyFindAuthByToken = "key.find.auth.by.token";


    @Bean
    public DirectExchange businessDirectExchange() {
        return new DirectExchange(businessDirectExchange);
    }



    @Bean
    public Queue queueFindAuthByToken(){
        return new Queue(queueFindAuthByToken);
    }

    @Bean
    public Binding bindingSaveDirectExchange(Queue queueFindAuthByToken, DirectExchange directExchange){
        return BindingBuilder.bind(queueFindAuthByToken).to(directExchange).with(keyFindAuthByToken);
    }

    @Bean
    MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }


    @Bean
    RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(messageConverter());
        return rabbitTemplate;
    }


}
