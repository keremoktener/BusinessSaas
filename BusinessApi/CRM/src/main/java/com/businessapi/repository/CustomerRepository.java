package com.businessapi.repository;

import com.businessapi.dto.response.CustomerResponseForOpportunityDTO;
import com.businessapi.dto.response.OpportunityResponseDTO;
import com.businessapi.entity.Customer;
import com.businessapi.utility.enums.EStatus;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    List<Customer> findAllByFirstNameContainingIgnoreCaseAndStatusAndMemberIdOrderByFirstNameAsc(String s, EStatus status,Long memberId, PageRequest of);

    Optional<Customer> findCustomerByEmailIgnoreCase(String email);

    @Query("SELECT new com.businessapi.dto.response.CustomerResponseForOpportunityDTO(c.id, c.firstName, c.lastName, c.email, c.phone, c.address) " +
            "FROM Customer c")
    List<CustomerResponseForOpportunityDTO> findAllByFirstNameContainingIgnoreCaseAndMemberIdOrderByFirstNameAsc(String s,Long memberId, PageRequest of);


    List<Customer> findByStatus(EStatus eStatus);

    boolean existsCustomerByPhone(String phone);
}
