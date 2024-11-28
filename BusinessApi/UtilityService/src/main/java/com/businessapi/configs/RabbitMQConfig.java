package com.businessapi.configs;

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
    //TODO QUEUES WILL CHANGE LATER
    String directExchange="businessDirectExchange";
    String queueFindAuthByToken = "find.auth.by.token";
    String keyFindAuthByToken = "key.find.auth.by.token";
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
    //Notification
    public static final String NOTIFICATION_QUEUE = "notificationQueue";
    public static final String NOTIFICATION_EXCHANGE = "notificationExchange";
    public static final String NOTIFICATION_ROUTING_KEY = "notificationKey";

    @Bean
    public DirectExchange directExchange(){
        return new DirectExchange(directExchange);
    }

    @Bean
    public Queue queue() {
        return new Queue(NOTIFICATION_QUEUE, false);
    }

    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(NOTIFICATION_EXCHANGE);
    }

    @Bean
    public Binding binding(Queue queue, TopicExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with(NOTIFICATION_ROUTING_KEY);
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
    RabbitTemplate rabbitTemplate(ConnectionFactory factory){
        RabbitTemplate rabbitTemplate = new RabbitTemplate(factory);
        rabbitTemplate.setMessageConverter(messageConverter());
        return rabbitTemplate;
    }
}
