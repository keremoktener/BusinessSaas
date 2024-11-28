package com.businessapi.service;

import com.businessapi.dto.request.*;
import com.businessapi.dto.response.TicketDetailsDTO;
import com.businessapi.entity.Customer;
import com.businessapi.entity.Ticket;
import com.businessapi.exception.CustomerServiceException;
import com.businessapi.exception.ErrorType;
import com.businessapi.repository.TicketRepository;
import com.businessapi.utility.SessionManager;
import com.businessapi.utility.enums.EStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketService {
    private final TicketRepository ticketRepository;
    private CustomerService customerService;
    private ActivityService activityService;

    @Autowired
    public void setService(@Lazy ActivityService activityService) {
        this.activityService = activityService;
    }

    @Autowired
    private void setService(@Lazy CustomerService customerService) {
        this.customerService = customerService;
    }

    public Boolean save(TicketSaveDTO dto) {
        ticketRepository.save(Ticket.builder()
                .subject(dto.subject())
                .description(dto.description())
                .ticketStatus(dto.ticketStatus())
                .priority(dto.priority())
                .createdDate(dto.createdDate())
                .closedDate(dto.closedDate())
                .memberId(SessionManager.getMemberIdFromAuthenticatedMember())
                .status(EStatus.ACTIVE)
                .build());
        activityService.log(ActivitySaveDTO.builder().type("info").message("Ticket created").build());
        return true;
    }
    public Boolean saveCustomerTicket(TicketForCustomerSaveDTO dto){
        Ticket ticket = ticketRepository.findById(dto.id()).orElseThrow(() -> new CustomerServiceException(ErrorType.BAD_REQUEST_ERROR));
        SessionManager.authorizationCheck(ticket.getMemberId());

        List<Customer> newCustomers = customerService.findAllByIds(dto.customers());
        if (dto.customers() == null || dto.customers().isEmpty()) {
            activityService.log(ActivitySaveDTO.builder().type("warning").message("Customers not found").build());
            throw new CustomerServiceException(ErrorType.BAD_REQUEST_ERROR);
        }
        List<Customer> existingCustomers = ticket.getCustomers();
        if (existingCustomers != null) {
            existingCustomers.addAll(newCustomers);
        } else {
            existingCustomers = newCustomers;
        }
        ticket.setCustomers(existingCustomers);
        ticketRepository.save(ticket);
        activityService.log(ActivitySaveDTO.builder().type("info").message("Ticket updated and added customer").build());
        return true;
    }

    public void saveForDemoData(TicketSaveDemoDTO dto) {
        Customer customer = customerService.findById(dto.customerId());
        ticketRepository.save(Ticket.builder().memberId(2L).customers(List.of(customer)).subject(dto.subject()).description(dto.description()).ticketStatus(dto.ticketStatus()).priority(dto.priority()).createdDate(dto.createdDate()).closedDate(dto.closedDate()).status(EStatus.ACTIVE).build());
    }

    public Boolean update(TicketUpdateDTO dto) {
        Ticket ticket = ticketRepository.findById(dto.id()).orElseThrow(() -> new CustomerServiceException(ErrorType.BAD_REQUEST_ERROR));
        if (ticket != null) {
            ticket.setSubject(dto.subject() != null ? dto.subject() : ticket.getSubject());
            ticket.setDescription(dto.description() != null ? dto.description() : ticket.getDescription());
            ticket.setTicketStatus(dto.ticketStatus() != null ? dto.ticketStatus() : ticket.getTicketStatus());
            ticket.setPriority(dto.priority() != null ? dto.priority() : ticket.getPriority());
            ticket.setCreatedDate(dto.createdDate() != null ? dto.createdDate() : ticket.getCreatedDate());
            ticket.setClosedDate(dto.closedDate() != null ? dto.closedDate() : ticket.getClosedDate());
            ticketRepository.save(ticket);
            activityService.log(ActivitySaveDTO.builder().type("info").message("Ticket updated").build());
            return true;
        }
        return false;
    }

    public Boolean delete(Long id) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new CustomerServiceException(ErrorType.BAD_REQUEST_ERROR));
        if (ticket != null && !ticket.getStatus().equals(EStatus.DELETED)) {
            ticket.setStatus(EStatus.DELETED);
            ticketRepository.save(ticket);
            activityService.log(ActivitySaveDTO.builder().type("info").message("Ticket deleted").build());
            return true;
        }
        activityService.log(ActivitySaveDTO.builder().type("warning").message("Ticket already deleted or null").build());
        return false;
    }

    public List<Ticket> findAll(PageRequestDTO dto) {
        return ticketRepository.findAllBySubjectContainingIgnoreCaseAndStatusAndMemberIdOrderBySubjectAsc(dto.searchText(), EStatus.ACTIVE, SessionManager.memberId, PageRequest.of(dto.page(), dto.size()));
    }

    public Ticket findById(Long id) {
        return ticketRepository.findById(id).orElseThrow(() -> new CustomerServiceException(ErrorType.BAD_REQUEST_ERROR));
    }

    public TicketDetailsDTO getDetails(Long id) {
        if (id == null) {
            activityService.log(ActivitySaveDTO.builder().type("warning").message("ID null").build());
            throw new CustomerServiceException(ErrorType.BAD_REQUEST_ERROR);
        }

        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new CustomerServiceException(ErrorType.BAD_REQUEST_ERROR));
        activityService.log(ActivitySaveDTO.builder().type("info").message("Ticket viewed").build());

        SessionManager.authorizationCheck(ticket.getMemberId());

        List<Long> customerIds = ticketRepository.findAllCustomersIdById(id);
        List<Customer> customers = customerService.findAllByIds(customerIds);


        if (ticket != null && ticket.getStatus().equals(EStatus.ACTIVE)) {

            List<CustomerDetailsDTO> customerDetails = customers.stream()
                    .map(customer -> CustomerDetailsDTO.builder()
                            .firstName(customer.getFirstName())
                            .lastName(customer.getLastName())
                            .build())
                    .collect(Collectors.toList());

            return TicketDetailsDTO.builder()
                    .subject(ticket.getSubject())
                    .description(ticket.getDescription())
                    .ticketStatus(ticket.getTicketStatus())
                    .priority(ticket.getPriority())
                    .createdDate(ticket.getCreatedDate().toString())
                    .closedDate(ticket.getClosedDate().toString())
                    .customers(customerDetails)
                    .build();
        }else {
            activityService.log(ActivitySaveDTO.builder().type("warning").message("Ticket not found").build());
            return null;
        }

    }

}
