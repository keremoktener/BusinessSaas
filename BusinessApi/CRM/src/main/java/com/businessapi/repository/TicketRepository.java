package com.businessapi.repository;

import com.businessapi.entity.Ticket;
import com.businessapi.utility.enums.EStatus;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findAllBySubjectContainingIgnoreCaseAndStatusAndMemberIdOrderBySubjectAsc(String s, EStatus eStatus, Long memberId, PageRequest of);

    @Query("SELECT c.id FROM Customer c JOIN c.opportunities o WHERE o.id = :id")
    List<Long> findAllCustomersIdById(@Param("id") Long id);
}
