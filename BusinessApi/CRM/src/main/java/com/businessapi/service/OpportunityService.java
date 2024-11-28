package com.businessapi.service;

import com.businessapi.RabbitMQ.Model.CustomerSendEmailAboutOpportunity;
import com.businessapi.dto.request.*;
import com.businessapi.dto.response.CustomerResponseForOpportunityDTO;
import com.businessapi.dto.response.OpportunityDetailsDTO;
import com.businessapi.dto.response.OpportunityResponseDTO;
import com.businessapi.entity.Customer;
import com.businessapi.entity.Opportunity;
import com.businessapi.entity.Ticket;
import com.businessapi.exception.CustomerServiceException;
import com.businessapi.exception.ErrorType;
import com.businessapi.repository.OpportunityRepository;
import com.businessapi.utility.SessionManager;
import com.businessapi.utility.enums.EStatus;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class OpportunityService {
    private final OpportunityRepository opportunityRepository;
    private CustomerService customerService;
    private ActivityService activityService;
    private final RabbitTemplate rabbitTemplate;

    @Autowired
    public void setService(@Lazy ActivityService activityService) {
        this.activityService = activityService;
    }

    @Autowired
    private void setService(@Lazy CustomerService customerService) {
        this.customerService = customerService;
    }

    public Boolean save(OpportunitySaveDTO dto) {

        Opportunity opportunity = Opportunity.builder()
                .name(dto.name())
                .description(dto.description())
                .value(dto.value())
                .stage(dto.stage())
                .probability(dto.probability())
                .memberId(SessionManager.getMemberIdFromAuthenticatedMember())
                .status(EStatus.ACTIVE)
                .build();
        opportunityRepository.save(opportunity);
        activityService.log(ActivitySaveDTO.builder().type("info").message("Opportunity created").build());

        return true;
    }

    @Transactional
    public Void saveCustomerOpportunity(OpportunityForCustomerSaveDTO dto) {
        Opportunity opportunity = opportunityRepository.findById(dto.id())
                .orElseThrow(() -> new CustomerServiceException(ErrorType.BAD_REQUEST_ERROR));

        SessionManager.authorizationCheck(opportunity.getMemberId());

        if (dto.customers() == null || dto.customers().isEmpty()) {
            activityService.log(ActivitySaveDTO.builder().type("warning").message("Customers not found").build());
            throw new CustomerServiceException(ErrorType.BAD_REQUEST_ERROR);
        }

        List<Customer> newCustomers = customerService.findAllByIds(dto.customers());

        List<Customer> existingCustomers = opportunity.getCustomers() != null ? opportunity.getCustomers() : new ArrayList<>();

        for (Customer newCustomer : newCustomers) {

            if (existingCustomers.stream().noneMatch(existingCustomer -> existingCustomer.getId().equals(newCustomer.getId()))) {
                existingCustomers.add(newCustomer);
            }
        }
        opportunity.setCustomers(existingCustomers);
        opportunityRepository.save(opportunity);
        activityService.log(ActivitySaveDTO.builder().type("info").message("Opportunity updated and added customer").build());

        if (!newCustomers.isEmpty()) {
            newCustomers.forEach(customer -> {
                CustomerSendEmailAboutOpportunity model = CustomerSendEmailAboutOpportunity.builder()
                        .title(opportunity.getName())
                        .description(opportunity.getDescription())
                        .value(opportunity.getValue())
                        .email(customer.getEmail())
                        .firstName(customer.getFirstName())
                        .lastName(customer.getLastName())
                        .build();

                rabbitTemplate.convertAndSend("businessDirectExchange", "keyCustomerSendEmailAboutOpportunity", model);
            });
        }

        return null;
    }


    public void saveForDemoData(OpportunitySaveDemoDTO dto) {
        Customer customer = customerService.findById(dto.customerId());
        opportunityRepository.save(Opportunity.builder().memberId(2L).name(dto.name()).description(dto.description()).value(dto.value()).stage(dto.stage()).probability(dto.probability()).customers(List.of(customer)).status(EStatus.ACTIVE).build());
    }


    public List<Opportunity> findAll(PageRequestDTO dto) {
        return opportunityRepository.findAllByNameContainingIgnoreCaseAndStatusAndMemberIdOrderByNameAsc(dto.searchText(), EStatus.ACTIVE, SessionManager.memberId, PageRequest.of(dto.page(), dto.size()));

    }

    public Boolean update(OpportunityUpdateDTO dto) {
        Opportunity opportunity = opportunityRepository.findById(dto.id())
                .orElseThrow(() -> new CustomerServiceException(ErrorType.BAD_REQUEST_ERROR));

        SessionManager.authorizationCheck(opportunity.getMemberId());

        if (opportunity != null) {
            opportunity.setName(dto.name() != null ? dto.name() : opportunity.getName());
            opportunity.setDescription(dto.description() != null ? dto.description() : opportunity.getDescription());
            opportunity.setValue(dto.value() != null ? dto.value() : opportunity.getValue());
            opportunity.setStage(dto.stage() != null ? dto.stage() : opportunity.getStage());
            opportunity.setProbability(dto.probability() != null ? dto.probability() : opportunity.getProbability());


            if (dto.customersToRemove() != null) {
                List<Customer> customersToRemove = customerService.findAllByIds(dto.customersToRemove());
                opportunity.getCustomers().removeAll(customersToRemove);
            }


            if (dto.customers() != null) {
                List<Customer> updatedCustomers = customerService.findAllByIds(dto.customers());
                opportunity.setCustomers(updatedCustomers);
            }

            opportunityRepository.save(opportunity);
            activityService.log(ActivitySaveDTO.builder().type("info").message("Opportunity updated").build());

            return true;
        } else {
            return false;
        }
    }

    public Boolean delete(Long id) {
        Opportunity opportunity = opportunityRepository.findById(id).orElseThrow(() -> new CustomerServiceException(ErrorType.BAD_REQUEST_ERROR));
        SessionManager.authorizationCheck(opportunity.getMemberId());
        if (opportunity != null && opportunity.getStatus().equals(EStatus.ACTIVE)) {
            opportunity.setStatus(EStatus.DELETED);
            opportunityRepository.save(opportunity);
            activityService.log(ActivitySaveDTO.builder().type("info").message("Opportunity deleted").build());
            return true;
        } else {
            return false;
        }

    }

    public Opportunity findById(Long id) {
        return opportunityRepository.findById(id).orElseThrow(() -> new CustomerServiceException(ErrorType.BAD_REQUEST_ERROR));
    }

    public List<OpportunityResponseDTO> findAllOpportunities() {
        return customerService.getAllCustomersForOpportunity();

    }

    public OpportunityDetailsDTO getDetails(Long id) {
        if (id == null) {
            activityService.log(ActivitySaveDTO.builder().type("warning").message("ID null").build());
            throw new CustomerServiceException(ErrorType.BAD_REQUEST_ERROR);
        }

        Opportunity opportunity = opportunityRepository.findById(id)
                .orElseThrow(() -> new CustomerServiceException(ErrorType.BAD_REQUEST_ERROR));


        SessionManager.authorizationCheck(opportunity.getMemberId());


        List<Long> customerIds = opportunityRepository.findAllCustomersIdById(id);
        List<Customer> customers = customerService.findAllByIds(customerIds);


        if (opportunity != null && opportunity.getStatus().equals(EStatus.ACTIVE)) {

            List<CustomerDetailsDTO> customerDetails = customers.stream()
                    .map(customer -> CustomerDetailsDTO.builder()
                            .firstName(customer.getFirstName())
                            .lastName(customer.getLastName())
                            .build())
                    .collect(Collectors.toList());

            activityService.log(ActivitySaveDTO.builder().type("info").message("Opportunity viewed").build());
            return OpportunityDetailsDTO.builder()
                    .name(opportunity.getName())
                    .description(opportunity.getDescription())
                    .value(opportunity.getValue())
                    .stage(opportunity.getStage())
                    .probability(opportunity.getProbability())
                    .customers(customerDetails)
                    .build();
        } else {
            activityService.log(ActivitySaveDTO.builder().type("warning").message("Opportunity not found").build());
            return null;

        }

    }

}
