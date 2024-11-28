package com.businessapi.service;

import com.businessapi.RabbitMQ.Model.AddRoleFromSubscriptionModel;
import com.businessapi.RabbitMQ.Model.EmailModal;
import com.businessapi.dto.request.SubscriptionHistoryRequestDto;
import com.businessapi.dto.request.SubscriptionSaveRequestDTO;
import com.businessapi.entity.Plan;
import com.businessapi.entity.Subscription;
import com.businessapi.entity.enums.ERoles;
import com.businessapi.entity.enums.EStatus;
import com.businessapi.entity.enums.ESubscriptionType;
import com.businessapi.exception.ErrorType;
import com.businessapi.exception.SubscriptionServiceException;
import com.businessapi.repository.SubscriptionRepository;
import com.businessapi.util.SessionManager;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubscriptionService {
    private final SubscriptionRepository subscriptionRepository;
    private final PlanService planService;
    private final RabbitTemplate rabbitTemplate;

    public List<Subscription> findUsersSubscriptionsByAuthId(Long authId) {
        return subscriptionRepository.findAllByAuthIdAndStatusNot(authId, EStatus.ENDED);
    }

    public Subscription subscribe(SubscriptionSaveRequestDTO dto) {
        Long authId = SessionManager.getMemberIdFromAuthenticatedMember();
        List<Subscription> activeSubscriptions = findUsersSubscriptionsByAuthId(authId);
        List<Plan> plans = activeSubscriptions.stream().map(Subscription::getPlan).toList();
        Set<ERoles> uniqueRoles = new HashSet<>(plans.stream().map(Plan::getRoles).flatMap(List::stream).toList());

        Subscription subscription = Subscription.builder()
                .authId(authId)
                .plan(planService.findById(dto.planId()))
                .startDate(LocalDateTime.now())
                .build();
        // TODO: Add subscription type
        if(dto.subscriptionType().equals(ESubscriptionType.MONTHLY)) {
            subscription.setEndDate(subscription.getStartDate().plusDays(10)); // Subscription for 10 days for testing
        } else if(dto.subscriptionType().equals(ESubscriptionType.YEARLY)) {
            subscription.setEndDate(subscription.getStartDate().plusYears(1));
        }

        uniqueRoles.addAll(planService.findById(dto.planId()).getRoles());
        rabbitTemplate.convertAndSend(
                "businessDirectExchange",
                "keyAddRoleFromSubscription",
                AddRoleFromSubscriptionModel.builder()
                        .authId(authId)
                        .roles(uniqueRoles.stream().map(ERoles::name).collect(Collectors.toList()))
                        .build()
        );

        // TODO: Send email
        System.out.println(subscription.toString());
        return subscriptionRepository.save(subscription);
    }

    public Boolean unsubscribe (Long planId) {
        Long authId = SessionManager.getMemberIdFromAuthenticatedMember();
        Subscription subscription = subscriptionRepository.findByPlanIdAndAuthIdAndStatus(planId, authId, EStatus.ACTIVE).orElseThrow(() -> new SubscriptionServiceException(ErrorType.SUBSCRIPTION_NOT_FOUND));
        subscription.setStatus(EStatus.CANCELLED);
        subscription.setCancellationDate(LocalDateTime.now());
        subscriptionRepository.save(subscription);
        return true;
    }

    public List<String> checkSubscriptions () {
        Long authId = SessionManager.getMemberIdFromAuthenticatedMember();
        List<Subscription> subscriptions = subscriptionRepository.findAllByAuthIdAndStatusNot(authId, EStatus.ENDED);
        subscriptions.forEach(subscription -> {
            if(subscription.getEndDate().isBefore(LocalDateTime.now())) {
                subscription.setStatus(EStatus.ENDED);
                subscriptionRepository.save(subscription);
            }
        });
        List<Subscription> activeSubscriptions = subscriptionRepository.findAllByAuthIdAndStatusNot(authId, EStatus.ENDED);
        List<Plan> plans = activeSubscriptions.stream().map(Subscription::getPlan).toList();
        Set<ERoles> uniqueRoles = new HashSet<>(plans.stream().map(Plan::getRoles).flatMap(List::stream).toList());
        rabbitTemplate.convertAndSend(
                "businessDirectExchange",
                "keyAddRoleFromSubscription",
                AddRoleFromSubscriptionModel.builder()
                        .authId(authId)
                        .roles(uniqueRoles.stream().map(ERoles::name).collect(Collectors.toList()))
                        .build()
        );
        return getActiveSubscriptionRoles(authId);
    }

    private List<String> getActiveSubscriptionRoles(Long authId) {
        List<Subscription> subscriptions = subscriptionRepository.findAllByAuthIdAndStatus(authId, EStatus.ACTIVE);
        List<Plan> plans = subscriptions.stream().map(Subscription::getPlan).toList();
        Set<ERoles> uniqueRoles = new HashSet<>(plans.stream().map(Plan::getRoles).flatMap(List::stream).toList());
        return uniqueRoles.stream().map(ERoles::name).collect(Collectors.toList());
    }

    public void subscribeToPlanForDemoData (Long authId, Long planId, int year) {
        subscriptionRepository.save(Subscription.builder().authId(authId).plan(planService.findById(planId)).startDate(LocalDateTime.now()).endDate(LocalDateTime.now().plusYears(year)).build());
    }

    public List<SubscriptionHistoryRequestDto> getSubscriptionHistory(String language) {
        Long authId = SessionManager.getMemberIdFromAuthenticatedMember();
        List<Subscription> subscriptions = subscriptionRepository.findAllByAuthId(authId);
        return subscriptions.stream().map(subscription -> subscription.toSubscriptionHistoryRequestDto(language)).collect(Collectors.toList());
    }

    public List<Plan> findAllActiveSubscriptionPlans() {
        Long authId = SessionManager.getMemberIdFromAuthenticatedMember();
        return subscriptionRepository.findAllByAuthIdAndStatus(authId, EStatus.ACTIVE).stream().map(Subscription::getPlan).toList();
    }

    //@Scheduled(cron = "0 0 0 * * ?") // Scheduled to run at 00:00 every day
    @Scheduled(cron = "0 */1 * * * ?") // Scheduled to run every minute For testing
    public void sendSubscriptionEndReminder() {
        System.out.println("scheduled method called");
        LocalDateTime tenDaysFromNowStart = LocalDateTime.now().plusDays(10).with(LocalTime.MIN);
        LocalDateTime tenDaysFromNowEnd = LocalDateTime.now().plusDays(10).with(LocalTime.MAX);

        List<Subscription> subscriptionsEndingSoon = subscriptionRepository.findByEndDateBetween(tenDaysFromNowStart, tenDaysFromNowEnd);
        for (Subscription subscription : subscriptionsEndingSoon) {
            sendEmail(subscription);
            //TODO: send notification
            //rabbitTemplate.convertAndSend("notificationExchange", "notificationKey", RabbitMQNotification.builder().title("").userIds().message("").build());
        }
    }

    private void sendEmail(Subscription subscription) {
        String usersMail = (String) rabbitTemplate.convertSendAndReceive("businessDirectExchange", "keyGetMailByAuthId", subscription.getAuthId());
        String subject = "Subscription Ending Soon / Aboneliğiniz Yakında Sona Erecek";

        // DateTimeFormatter for both languages
        DateTimeFormatter englishFormatter = DateTimeFormatter.ofPattern("MMMM d, yyyy", Locale.ENGLISH);
        DateTimeFormatter turkishFormatter = DateTimeFormatter.ofPattern("d MMMM yyyy", Locale.of("tr", "TR"));

        String formattedDateEnglish = subscription.getEndDate().format(englishFormatter);
        String formattedDateTurkish = subscription.getEndDate().format(turkishFormatter);
        String htmlContent = getHtmlContent(subscription, formattedDateEnglish, formattedDateTurkish);

        EmailModal emailObject = new EmailModal(usersMail, subject, htmlContent, true);
        rabbitTemplate.convertAndSend("businessDirectExchange", "keySendStyledEmail", emailObject);
    }

    private static String getHtmlContent(Subscription subscription, String formattedDateEnglish, String formattedDateTurkish) {
        Plan plan = subscription.getPlan();
        String htmlContent = "<html><body>" +
                "<table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" width=\"100%\" style=\"font-family:Arial,sans-serif;color:#333;background-color:#f9f9f9;padding:20px;\">" +
                "    <tr>" +
                "        <td style=\"background-color:#ffffff;border-radius:8px;box-shadow:0 0 10px rgba(0,0,0,0.1);\">" +
                "            <table cellpadding=\"20\" cellspacing=\"0\" width=\"100%\">" +
                "                <tr>" +
                "                    <td style=\"text-align:left;\">" +
                "                        <h1 style=\"color:#333333;font-size:24px;margin:0;\">Dear User,</h1>" +
                "                        <p style=\"font-size:16px;color:#555555;\">Your subscription on " + plan.getPlanTranslationByLanguage("en").getName() +" will end on " + formattedDateEnglish + ". Please renew it before the expiry date.</p>" +
                "                        <h1 style=\"color:#333333;font-size:24px;margin:0;\">Sayın Kullanıcı,</h1>" +
                "                        <p style=\"font-size:16px;color:#555555;\">"+ plan.getPlanTranslationByLanguage("tr").getName()+" Aboneliğiniz " + formattedDateTurkish + " tarihinde sona erecek. Lütfen süresi dolmadan yenileyin.</p>" +
                "                    </td>" +
                "                </tr>" +
                "                <tr>" +
                "                    <td style=\"text-align:left;padding-top:20px;\">" +
                "                        <p style=\"font-size:14px;color:#888888;margin:0;\">Best regards,</p>" +
                "                        <p style=\"font-size:14px;color:#888888;margin:0;\">BUSINESS®</p>" +
                "                        <p style=\"font-size:14px;color:#888888;margin:0;\">Saygılarımızla,</p>" +
                "                        <p style=\"font-size:14px;color:#888888;margin:0;\">BUSINESS®</p>" +
                "                    </td>" +
                "                </tr>" +
                "            </table>" +
                "        </td>" +
                "    </tr>" +
                "</table>" +
                "</body></html>";
        return htmlContent;
    }
}
