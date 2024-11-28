package com.businessapi.utility;


import com.businessapi.dto.request.*;
import com.businessapi.service.*;
import com.businessapi.utility.enums.EStatus;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@RequiredArgsConstructor
@Service
public class DemoDataGenerator {
    private final CustomerService customerService;
    private final MarketingCampaignService marketingCampaignService;
    private final TicketService ticketService;
    private final OpportunityService opportunityService;


    @PostConstruct
    public void generateDemoData() {
        customerDemoData();
        marketingCampaignDemoData();
        ticketDemoData();
        opportunityDemoData();

    }

    private void customerDemoData() {
        customerService.saveForDemoData(new CustomerSaveDemoDTO("John", "Doe", "johndoe@gmail.com", "123456789", "123 Main St", EStatus.ACTIVE));
        customerService.saveForDemoData(new CustomerSaveDemoDTO("Jane", "Doe", "janedoe@gmail.com", "123456789", "123 Main St", EStatus.ACTIVE));
        customerService.saveForDemoData(new CustomerSaveDemoDTO("Bob", "Smith", "bobsmith@gmail.com", "123456789", "123 Main St", EStatus.ACTIVE));
        customerService.saveForDemoData(new CustomerSaveDemoDTO("Alice", "Johnson", "alicejohnson@gmail.com", "123456789", "123 Main St", EStatus.ACTIVE));
        customerService.saveForDemoData(new CustomerSaveDemoDTO("Tom", "Lee", "tomlee@gmail.com", "123456789", "123 Main St", EStatus.ACTIVE));
        customerService.saveForDemoData(new CustomerSaveDemoDTO("Sarah", "Brown", "sarahbrown@gmail.com", "123456789", "123 Main St", EStatus.ACTIVE));
        customerService.saveForDemoData(new CustomerSaveDemoDTO("Michael", "Davis", "michaeldavis@gmail.com", "123456789", "123 Main St", EStatus.ACTIVE));
        customerService.saveForDemoData(new CustomerSaveDemoDTO("Emily", "Wilson", "emilywilson@gmail.com", "123456789", "123 Main St", EStatus.ACTIVE));
        customerService.saveForDemoData(new CustomerSaveDemoDTO("Olivia", "Martinez", "oliviamartinez@gmail.com", "123456789", "123 Main St", EStatus.ACTIVE));
        customerService.saveForDemoData(new CustomerSaveDemoDTO("William", "Anderson", "williamanderson@gmail.com", "123456789", "123 Main St", EStatus.ACTIVE));
        customerService.saveForDemoData(new CustomerSaveDemoDTO("Ava", "Thomas", "avathomas@gmail.com", "123456789", "123 Main St", EStatus.ACTIVE));
    }


    private void marketingCampaignDemoData() {
        marketingCampaignService.saveForDemoData(new MarketingCampaignSaveDemoDTO("Summer Sales Boost",
                "Increase sales through summer discounts",
                LocalDate.of(2024, 6, 1),
                LocalDate.of(2024, 8, 31),
                15000.0));

        marketingCampaignService.saveForDemoData(new MarketingCampaignSaveDemoDTO("Winter Sales Promotion",
                "Promote sales through winter discounts",
                LocalDate.of(2024, 12, 1),
                LocalDate.of(2024, 12, 31),
                10000.0));

        marketingCampaignService.saveForDemoData(new MarketingCampaignSaveDemoDTO("Spring Sales Promotion",
                "Promote sales through spring discounts",
                LocalDate.of(2024, 3, 1),
                LocalDate.of(2024, 5, 31),
                12000.0));

        marketingCampaignService.saveForDemoData(new MarketingCampaignSaveDemoDTO("Fall Sales Promotion",
                "Promote sales through fall discounts",
                LocalDate.of(2024, 9, 1),
                LocalDate.of(2024, 11, 30),
                18000.0));

        marketingCampaignService.saveForDemoData(new MarketingCampaignSaveDemoDTO("Christmas Sales Promotion",
                "Promote sales through Christmas discounts",
                LocalDate.of(2024, 12, 25),
                LocalDate.of(2024, 12, 31),
                20000.0));
    }

    private void ticketDemoData() {
        ticketService.saveForDemoData(new TicketSaveDemoDTO(3L,
                "Login Issue",
                "Customer unable to login to their account",
                "OPEN",
                "HIGH",
                LocalDate.of(2024, 9, 1),
                LocalDate.of(2024, 9, 15)));

        ticketService.saveForDemoData(new TicketSaveDemoDTO(2L,
                "Payment Issue",
                "Customer unable to make payment",
                "OPEN",
                "MEDIUM",
                LocalDate.of(2024, 9, 1),
                LocalDate.of(2024, 9, 15)));

        ticketService.saveForDemoData(new TicketSaveDemoDTO(5L,
                "Order Issue",
                "Customer unable to place order",
                "OPEN",
                "LOW",
                LocalDate.of(2024, 9, 1),
                LocalDate.of(2024, 9, 15)));

        ticketService.saveForDemoData(new TicketSaveDemoDTO(4L,
                "Shipping Issue",
                "Customer unable to ship order",
                "OPEN",
                "HIGH",
                LocalDate.of(2024, 9, 1),
                LocalDate.of(2024, 9, 15)));

        ticketService.saveForDemoData(new TicketSaveDemoDTO(4L,
                "Return Issue",
                "Customer unable to return order",
                "OPEN",
                "MEDIUM",
                LocalDate.of(2024, 9, 1),
                LocalDate.of(2024, 9, 15)));

    }

    private void opportunityDemoData() {
        opportunityService.saveForDemoData(new OpportunitySaveDemoDTO(1L,
                "New Website Development",
                "Develop a new website for the client",
                50000.0,
                "Proposal Sent",
                75.0
                ));

        opportunityService.saveForDemoData(new OpportunitySaveDemoDTO(2L,
                "Mobile App Development",
                "Develop a new mobile app for the client",
                80000.0,
                "Proposal Sent",
                75.0
                ));
        opportunityService.saveForDemoData(new OpportunitySaveDemoDTO(3L,
                "Mobile App Development",
                "Develop a new mobile app for the client",
                80000.0,
                "Proposal Sent",
                75.0
        ));

        opportunityService.saveForDemoData(new OpportunitySaveDemoDTO(3L,
                "Software Development",
                "Develop a new software for the client",
                100000.0,
                "Proposal Sent",
                75.0
            ));

        opportunityService.saveForDemoData(new OpportunitySaveDemoDTO(4L,
                "Hardware Repair",
                "Repair hardware for the client",
                30000.0,
                "Proposal Sent",
                75.0
                ));

        opportunityService.saveForDemoData(new OpportunitySaveDemoDTO(5L,
                "Software Upgrade",
                "Upgrade software for the client",
                60000.0,
                "Proposal Sent",
                75.0
                ));
    }






}
