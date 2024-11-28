package com.businessapi.services;

import com.businessapi.dto.request.PageRequestDTO;
import com.businessapi.dto.response.CustomerSaveRequestDTO;
import com.businessapi.dto.response.CustomerUpdateRequestDTO;
import com.businessapi.entities.Customer;
import com.businessapi.entities.enums.EStatus;
import com.businessapi.exception.ErrorType;
import com.businessapi.exception.StockServiceException;
import com.businessapi.repositories.CustomerRepository;
import com.businessapi.util.SessionManager;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class CustomerService
{
    private final CustomerRepository customerRepository;

    public Boolean save(CustomerSaveRequestDTO dto)
    {
        if (!isValidEmail(dto.email()))
        {
            throw new StockServiceException(ErrorType.INVALID_EMAIL);
        }
        if (customerRepository.existsByIdentityNoAndMemberId(dto.identityNo(), SessionManager.getMemberIdFromAuthenticatedMember()))
        {
            throw new StockServiceException(ErrorType.IDENTITY_NO_ALREADY_EXISTS);
        }
        if (customerRepository.findCustomerByEmailIgnoreCaseAndMemberId(dto.email(), SessionManager.getMemberIdFromAuthenticatedMember()).isPresent())
        {
            throw new StockServiceException(ErrorType.EMAIL_ALREADY_EXISTS);
        }
        customerRepository.save(Customer.builder().identityNo(dto.identityNo()).phoneNo(dto.phoneNo()).memberId(SessionManager.getMemberIdFromAuthenticatedMember()).name(dto.name()).surname(dto.surname()).email(dto.email()).build());
        return true;
    }

    private boolean isValidEmail(String email)
    {

        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
        Pattern pattern = Pattern.compile(emailRegex);
        Matcher matcher = pattern.matcher(email);
        return matcher.matches();
    }

    public void saveForDemoData(CustomerSaveRequestDTO dto)
    {
        if (customerRepository.findCustomerByEmailIgnoreCase(dto.email()).isPresent())
        {
            throw new StockServiceException(ErrorType.EMAIL_ALREADY_EXISTS);
        }
        customerRepository.save(Customer.builder().identityNo(dto.identityNo()).phoneNo(dto.phoneNo()).memberId(2L).name(dto.name()).surname(dto.surname()).email(dto.email()).build());
    }

    public Boolean delete(Long id)
    {
        Customer customer = customerRepository.findByIdAndMemberId(id, SessionManager.getMemberIdFromAuthenticatedMember()).orElseThrow(() -> new StockServiceException(ErrorType.CUSTOMER_NOT_FOUND));
        customer.setStatus(EStatus.DELETED);
        customerRepository.save(customer);
        return true;
    }

    public Boolean update(CustomerUpdateRequestDTO dto)
    {
        if (!isValidEmail(dto.email()))
        {
            throw new StockServiceException(ErrorType.INVALID_EMAIL);
        }
        Customer customer = customerRepository.findByIdAndMemberId(dto.id(), SessionManager.getMemberIdFromAuthenticatedMember()).orElseThrow(() -> new StockServiceException(ErrorType.CUSTOMER_NOT_FOUND));
        if (!customer.getEmail().equals(dto.email()))
        {
            if (customerRepository.findCustomerByEmailIgnoreCaseAndMemberId(dto.email(), SessionManager.getMemberIdFromAuthenticatedMember()).isPresent())
            {
                throw new StockServiceException(ErrorType.EMAIL_ALREADY_EXISTS);
            }
        }
        if (!customer.getIdentityNo().equals(dto.identityNo()))
        {
            if (customerRepository.existsByIdentityNoAndMemberId(dto.identityNo(), SessionManager.getMemberIdFromAuthenticatedMember()))
            {
                throw new StockServiceException(ErrorType.IDENTITY_NO_ALREADY_EXISTS);
            }
        }
        customer.setName(dto.name());
        customer.setSurname(dto.surname());
        customer.setEmail(dto.email());
        customer.setIdentityNo(dto.identityNo());
        customer.setPhoneNo(dto.phoneNo());
        customerRepository.save(customer);
        return true;
    }

    public List<Customer> findAllByNameContainingIgnoreCaseAndStatusIsNotAndMemberIdOrderByNameAsc(PageRequestDTO dto)
    {
        return customerRepository.findAllByNameContainingIgnoreCaseAndStatusIsNotAndMemberIdOrderByNameAsc(dto.searchText(), EStatus.DELETED, SessionManager.getMemberIdFromAuthenticatedMember(), PageRequest.of(dto.page(), dto.size()));
    }

    public Customer findByIdAndMemberId(Long id)
    {


        return customerRepository.findByIdAndMemberId(id, SessionManager.getMemberIdFromAuthenticatedMember()).orElseThrow(() -> new StockServiceException(ErrorType.CUSTOMER_NOT_FOUND));
    }


    public Customer findbyId(Long aLong)
    {
        return customerRepository.findById(aLong).orElseThrow(() -> new StockServiceException(ErrorType.CUSTOMER_NOT_FOUND));
    }
}
