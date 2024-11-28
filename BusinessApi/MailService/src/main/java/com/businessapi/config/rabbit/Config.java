package com.businessapi.config.rabbit;

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
public class Config {
    private final String businessDirectExchange = "businessDirectExchange";
    private final String queueSendVerificationEmail = "queueSendVerificationEmail";
    private final String keySendVerificationEmail = "keySendVerificationEmail";
    private final String queueForgetPassword = "queueForgetPassword";
    private final String keyForgetPassword = "keyForgetPassword";
    private final String queueSendMail = "queueSendMail";
    private final String keySendMail = "keySendMail";
    //Admin Tarafından Kullanıcıya yeni şifre göndermek için mailService iletişim kuyruğı
    private static final String queueSendMailNewPassword = "queueSendMailNewPassword";
    private static final String keySendMailNewPassword = "keySendMailNewPassword";
    private final String queueSendStyledEmail = "queueSendStyledEmail";
    private final String keySendStyledEmail = "keySendStyledEmail";
    String queueSaveCustomerSendMail = "queueSaveCustomerSendMail";
    String keySaveCustomerSendMail = "keySaveCustomerSendMail";
    String queueCustomerSendEmailAboutOpportunity = "queueCustomerSendEmailAboutOpportunity";
    String keyCustomerSendEmailAboutOpportunity = "keyCustomerSendEmailAboutOpportunity";

    @Bean
    public DirectExchange directExchange(){
        return new DirectExchange(businessDirectExchange);
    }

    @Bean
    public Queue queueSendVerificationEmail(){
        return new Queue(queueSendVerificationEmail);
    }

    @Bean
    public Binding bindingSendVerificationEmail(){
        return BindingBuilder.bind(queueSendVerificationEmail()).to(directExchange()).with(keySendVerificationEmail);
    }
    @Bean
    public Queue queueSendMail(){
        return new Queue(queueSendMail);
    }
    @Bean
    public Binding bindingKeySendMail(){
        return BindingBuilder.bind(queueSendMail()).to(directExchange()).with(keySendMail);
    }
    @Bean
    public Queue queueSendStyledEmail(){
        return new Queue(queueSendStyledEmail);
    }
    @Bean
    public Binding bindingKeySendStyledEmail(){
        return BindingBuilder.bind(queueSendStyledEmail()).to(directExchange()).with(keySendStyledEmail);
    }

    @Bean
    MessageConverter messageConverter(){
        return new Jackson2JsonMessageConverter();
    }
    @Bean
    public Queue queueForgetPassword() {
        return new Queue(queueForgetPassword);
    }

    @Bean
    public Queue queueSendMailNewPassword() {
        return new Queue(queueSendMailNewPassword);
    }
    @Bean
    public Binding bindingSendMailNewPassword (Queue queueSendMailNewPassword, DirectExchange businessDirectExchange) {
        return BindingBuilder.bind(queueSendMailNewPassword).to(businessDirectExchange).with(keySendMailNewPassword);
    }

    @Bean
    public Binding bindingForgetPassword (Queue queueForgetPassword, DirectExchange businessDirectExchange) {
        return BindingBuilder.bind(queueForgetPassword).to(businessDirectExchange).with(keyForgetPassword);
    }

    @Bean
    public Queue queueSaveCustomerSendMail(){
        return new Queue(queueSaveCustomerSendMail);
    }
    @Bean
    public Binding bindingSaveCustomerSendEmail(Queue queueSaveCustomerSendMail, DirectExchange directExchange){
        return BindingBuilder.bind(queueSaveCustomerSendMail).to(directExchange).with(keySaveCustomerSendMail);
    }

    @Bean
    public Queue queueCustomerSendEmailAboutOpportunity(){
        return new Queue(queueCustomerSendEmailAboutOpportunity);
    }
//    @Bean
//    public Binding bindingCustomerSendEmailAboutOpportunity(Queue queueCustomerSendEmailAboutOpportunity, DirectExchange directExchange){
//        return BindingBuilder.bind(queueCustomerSendEmailAboutOpportunity).to(directExchange).with(keyCustomerSendEmailAboutOpportunity);
//    }


    RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory){
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(messageConverter());
        return rabbitTemplate;
    }

}
