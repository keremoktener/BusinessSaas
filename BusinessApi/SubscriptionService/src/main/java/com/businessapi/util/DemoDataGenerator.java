package com.businessapi.util;
import com.businessapi.dto.request.PlanSaveRequestDTO;
import com.businessapi.entity.Plan;
import com.businessapi.entity.PlanTranslation;
import com.businessapi.entity.enums.ERoles;
import com.businessapi.repository.PlanTranslationRepository;
import com.businessapi.service.PlanService;
import com.businessapi.service.SubscriptionService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class DemoDataGenerator {
    private final PlanService planService;
    private final SubscriptionService subscriptionService;
    @PostConstruct
    public void generateDemoData() {
        planDemoData();
        userDemoData();
    }

    private void planDemoData() {
        planService.save(PlanSaveRequestDTO.builder().translations(List.of(PlanTranslation.builder().language("en").name("Project Management Module").description("PMM").build(),
                PlanTranslation.builder().language("tr").name("Proje Yönetimi Modülü").description("PMM").build())).price(100.0).roles(List.of(ERoles.PMM)).build());
        planService.save(PlanSaveRequestDTO.builder().translations(List.of(PlanTranslation.builder().language("en").name("Customer Relationship Management Module").description("CRMM").build(),
                PlanTranslation.builder().language("tr").name("Müşteri İlişkileri Yönetimi Modülü").description("CRMM").build())).price(200.0).roles(List.of(ERoles.CRMM)).build());
        planService.save(PlanSaveRequestDTO.builder().translations(List.of(PlanTranslation.builder().language("en").name("Inventory Management Module").description("IMM").build(),
                PlanTranslation.builder().language("tr").name("Envanter Yönetimi Modülü").description("IMM").build())).price(300.0).roles(List.of(ERoles.IMM)).build());
        planService.save(PlanSaveRequestDTO.builder().translations(List.of(PlanTranslation.builder().language("en").name("Human Resources Management Module").description("HRMM").build(),
                PlanTranslation.builder().language("tr").name("İnsan Kaynakları Yönetim Modülü").description("HRMM").build())).price(300.0).roles(List.of(ERoles.HRMM)).build());
        planService.save(PlanSaveRequestDTO.builder().translations(List.of(PlanTranslation.builder().language("en").name("Finance and Accounting Module").description("FAM").build(),
                PlanTranslation.builder().language("tr").name("Finans ve Muhasebe Modülü").description("FAM").build())).price(300.0).roles(List.of(ERoles.FAM)).build());
        planService.save(PlanSaveRequestDTO.builder().translations(List.of(PlanTranslation.builder().language("en").name("Operation Analysis Module").description("OAM").build(),
                PlanTranslation.builder().language("tr").name("Operasyon Analiz Modülü").description("OAM").build())).price(300.0).roles(List.of(ERoles.OAM)).build());
    }

    private void userDemoData(){
        subscriptionService.subscribeToPlanForDemoData(2L,1L,1);
        subscriptionService.subscribeToPlanForDemoData(2L,2L,1);
        subscriptionService.subscribeToPlanForDemoData(2L,3L,1);
        subscriptionService.subscribeToPlanForDemoData(2L,4L,1);
        subscriptionService.subscribeToPlanForDemoData(2L,5L,1);
        subscriptionService.subscribeToPlanForDemoData(2L,6L,1);
    }
}
