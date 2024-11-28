package com.businessapi.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.rabbit.listener.api.RabbitListenerErrorHandler;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.ErrorHandler;


@Configuration
public class RabbitConfig {
    private final String businessDirectExchange = "businessDirectExchange";

    //Auth'dan register olup otomatik oluşturularacak user'lar için queue ve key
    private final String queueSaveUserFromAuth = "queueSaveUserFromAuth";
    private final String keySaveUserFromAuth = "keySaveUserFromAuth";


    // Bir user mail adresini update ettiğinde bunun auth'da da update edilmesi için gerekli queue ve key
    private final String queueAuthMailUpdateFromUser = "queueAuthMailUpdateFromUser";
    private final String keyAuthMailUpdateFromUser = "keyAuthMailUpdateFromUser";


    //userdan customer oluştuma
    private final String queueSaveCustomerFromUser = "queueSaveCustomerFromUser";
    private final String keySaveCustomerFromUser = "keySaveCustomerFromUser";


    //GelenAuthId ile security için Rolleri gönderme
    private final String queueRolesByAuthId = "queueRolesByAuthId";
    private final String keyRolesByAuthId = "keyRolesByAuthId";


    //AuthId ile auth servisten email ve password isteme (securit için gerekli)
    private final String queueEmailAndPasswordFromAuth = "queueEmailAndPasswordFromAuth";
    private final String keyEmailAndPasswordFromAuth = "keyEmailAndPasswordFromAuth";

    //Admin tarafından deled edilen kullanıcıların auth'da da deleted edilmesi için gerekn kuyrul
    private final String queueDeleteAuth = "queueDeleteAuth";
    private final String keyDeleteAuth = "keyDeleteAuth";


    //Auth hesabı mail ile activate edilen kullanıcının user'ının da activate edilmesi
    private final String queueActivateUserFromAuth = "queueActivateUserFromAuth";
    private final String keyActivateUserFromAuth = "keyActivateUserFromAuth";

    //Adminin oluşturduğu user'dan auth oluşturmak için gerekli bilgilerin gönderildiği kuyruk

    private final String queueSaveAuthFromUser = "queueSaveAuthFromUser";
    private final String keySaveAuthFromUser = "keySaveAuthFromUser";


    //Notification için gerekli kuyruk yapısı
    public static final String NOTIFICATION_QUEUE = "notificationQueue";
    public static final String NOTIFICATION_EXCHANGE = "notificationExchange";
    public static final String NOTIFICATION_ROUTING_KEY = "notificationKey";

    //Diğer Servislerden  kullanıcı kaydetme talebi
    public static final String queueSaveUserFromOtherServices = "queueSaveUserFromOtherServices";
    public static final String keySaveUserFromOtherServices = "keySaveUserFromOtherServices";


    //authId ile auth servisten kullanıcının mail adresini almak için kullanılan kuyrul yapısı
    public static final String queueGetMailByAuthId = "queueGetMailByAuthId";
    public static final String keyGetMailByAuthId = "keyGetMailByAuthId";
    //Satın alma işlemi sonrası rol ataması için kullanılacak bağlantıda gerekli kuyruk yapısı
    public static final String queueAddRoleFromSubscription = "queueAddRoleFromSubscription";
    public static final String keyAddRoleFromSubscription = "keyAddRoleFromSubscription";

    //Satın alımı bitmiş modülleri kullanıcıdan silme
    public static final String queueDeleteRoleFromSubscription = "queueDeleteRoleFromSubscription";
    public static final String keyDeleteRoleFromSubscription = "keyDeleteRoleFromSubscription";

    //Admin tarafından kullanıcının şifresinin yenilenmesi
    private static final String queueChangePasswordFromUser = "queueChangePasswordFromUser";
    private static final String keyChangePasswordFromUser = "keyChangePasswordFromUser";

    //Admin tarafından kullanıcı status update'i
    private static final String queueUpdateStatus = "queueUpdateStatus";
    private static final String keyUpdateStatus = "keyUpdateStatus";

    //Token karşığılığında userId gönderilmesi
    private static final String queueGetUserIdByToken = "queueGetUserIdByToken";
    private static final String keyGetUserIdByToken = "keyGetUserIdByToken";
    //Admin Tarafından Kullanıcıya yeni şifre göndermek için mailService iletişim kuyruğı
    private static final String queueSendMailNewPassword = "queueSendMailNewPassword";
    private static final String keySendMailNewPassword = "keySendMailNewPassword";

    //Email'in var olup olmadığını kontrol etmek için gerekli kuyruk yapısı
    private static final String queueCheckEmailExists = "queueCheckEmailExists";
    private static final String keyCheckEmailExists = "keyCheckEmailExists";


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
    public DirectExchange businessDirectExchange() {
        return new DirectExchange(businessDirectExchange);
    }





    @Bean
    public Queue queueSaveUserFromAuth() {
        return new Queue(queueSaveUserFromAuth);
    }

    @Bean
    public Queue queueAuthMailUpdateFromUser() {
        return new Queue(queueAuthMailUpdateFromUser);
    }

    @Bean
    public Queue queueSaveCustomerFromUser() {
        return new Queue(queueSaveCustomerFromUser);
    }

    @Bean
    public Queue queueRolesByAuthId() {
        return new Queue(queueRolesByAuthId);
    }

    @Bean
    public Queue queueEmailAndPasswordFromAuth() {
        return new Queue(queueEmailAndPasswordFromAuth);
    }

    @Bean
    public Queue queueDeleteAuth() {
        return new Queue(queueDeleteAuth);
    }

    @Bean
    public Queue queueActivateUserFromAuth() {
        return new Queue(queueActivateUserFromAuth);
    }

    @Bean
    public Queue queueSaveAuthFromUser() {
        return new Queue(queueSaveAuthFromUser);
    }

    @Bean
    public Queue queueSaveUserFromOtherServices() {
        return new Queue(queueSaveUserFromOtherServices);
    }

    @Bean
    public Queue queueGetMailByAuthId() {
        return new Queue(queueGetMailByAuthId);
    }



    @Bean
    public Queue queueAddRoleFromSubscription() {
        return new Queue(queueAddRoleFromSubscription);
    }
    @Bean
    public Queue queueDeleteRoleFromSubscription() {
        return new Queue(queueDeleteRoleFromSubscription);
    }
    @Bean
    public Queue queueChangePasswordFromUser() {
        return new Queue(queueChangePasswordFromUser);
    }
    @Bean
    public Queue queueUpdateStatus() {
        return new Queue(queueUpdateStatus);
    }
    @Bean
    public Queue queueGetUserIdByToken() {
        return new Queue(queueGetUserIdByToken);
    }
    @Bean
    public Queue queueSendMailNewPassword() {
        return new Queue(queueSendMailNewPassword);
    }
    @Bean
    public Queue queueCheckEmailExists() {
        return new Queue(queueCheckEmailExists);
    }



    @Bean
    public Binding bindingAuthMailUpdateFromUserBinding(Queue queueAuthMailUpdateFromUser, DirectExchange businessDirectExchange) {
        return BindingBuilder.bind(queueAuthMailUpdateFromUser).to(businessDirectExchange).with(keyAuthMailUpdateFromUser);
    }

    @Bean
    public Binding bindingUserSaveFromAuth (Queue queueSaveUserFromAuth, DirectExchange businessDirectExchange) {
        return BindingBuilder.bind(queueSaveUserFromAuth).to(businessDirectExchange).with(keySaveUserFromAuth);
    }

    @Bean
    public Binding bindingCustomerSaveFromUser(Queue queueSaveCustomerFromUser, DirectExchange businessDirectExchange) {
        return BindingBuilder.bind(queueSaveCustomerFromUser).to(businessDirectExchange).with(keySaveCustomerFromUser);
    }

    @Bean
    public Binding bindingRolesByAuthId (Queue queueRolesByAuthId, DirectExchange businessDirectExchange) {
        return BindingBuilder.bind(queueRolesByAuthId).to(businessDirectExchange).with(keyRolesByAuthId);
    }

    @Bean
    public Binding bindingEmailAndPasswordFromAuth (Queue queueEmailAndPasswordFromAuth, DirectExchange businessDirectExchange) {
        return BindingBuilder.bind(queueEmailAndPasswordFromAuth).to(businessDirectExchange).with(keyEmailAndPasswordFromAuth);
    }

    @Bean
    public Binding bindingDeleteAuth (Queue queueDeleteAuth, DirectExchange businessDirectExchange) {
        return BindingBuilder.bind(queueDeleteAuth).to(businessDirectExchange).with(keyDeleteAuth);
    }

    @Bean
    public Binding bindingActivateUserFromAuth (Queue queueActivateUserFromAuth, DirectExchange businessDirectExchange) {
        return BindingBuilder.bind(queueActivateUserFromAuth).to(businessDirectExchange).with(keyActivateUserFromAuth);
    }
    @Bean
    public Binding bindingSaveAuthFromUser(Queue queueSaveAuthFromUser, DirectExchange businessDirectExchange) {
        return BindingBuilder.bind(queueSaveAuthFromUser).to(businessDirectExchange).with(keySaveAuthFromUser);
    }

    @Bean
    public Binding bindingSaveUserFromOtherServices(Queue queueSaveUserFromOtherServices, DirectExchange businessDirectExchange) {
        return BindingBuilder.bind(queueSaveUserFromOtherServices).to(businessDirectExchange).with(keySaveUserFromOtherServices);
    }

    @Bean
    public Binding bindingGetMailByAuthId(Queue queueGetMailByAuthId, DirectExchange businessDirectExchange) {
        return BindingBuilder.bind(queueGetMailByAuthId).to(businessDirectExchange).with(keyGetMailByAuthId);
    }
    @Bean
    public Binding bindingAddRoleFromSubscription (Queue queueAddRoleFromSubscription, DirectExchange businessDirectExchange) {
        return BindingBuilder.bind(queueAddRoleFromSubscription).to(businessDirectExchange).with(keyAddRoleFromSubscription);
    }
    @Bean
    public Binding bindingDeleteRoleFromSubscription (Queue queueDeleteRoleFromSubscription, DirectExchange businessDirectExchange) {
        return BindingBuilder.bind(queueDeleteRoleFromSubscription).to(businessDirectExchange).with(keyDeleteRoleFromSubscription);
    }
    @Bean
    public Binding bindingChangePasswordFromUser(Queue queueChangePasswordFromUser, DirectExchange businessDirectExchange) {
        return BindingBuilder.bind(queueChangePasswordFromUser).to(businessDirectExchange).with(keyChangePasswordFromUser);
    }
    @Bean
    public Binding bindingUpdateStatus(Queue queueUpdateStatus, DirectExchange businessDirectExchange) {
        return BindingBuilder.bind(queueUpdateStatus).to(businessDirectExchange).with(keyUpdateStatus);
    }
    @Bean
    public Binding bindingGetUserIdByToken (Queue queueGetUserIdByToken, DirectExchange businessDirectExchange) {
        return BindingBuilder.bind(queueGetUserIdByToken).to(businessDirectExchange).with(keyGetUserIdByToken);
    }
    @Bean
    public Binding bindingSendMailNewPassword (Queue queueSendMailNewPassword, DirectExchange businessDirectExchange) {
        return BindingBuilder.bind(queueSendMailNewPassword).to(businessDirectExchange).with(keySendMailNewPassword);
    }
    @Bean
    public Binding bindingCheckEmailExist(Queue queueCheckEmailExists, DirectExchange businessDirectExchange) {
        return BindingBuilder.bind(queueCheckEmailExists).to(businessDirectExchange).with(keyCheckEmailExists);
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


   /* @Bean
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(ConnectionFactory connectionFactory) {
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setDefaultRequeueRejected(false); // Hata durumunda mesajın tekrar kuyruğa dönmesini engeller
        return factory;
    }
*/




}
