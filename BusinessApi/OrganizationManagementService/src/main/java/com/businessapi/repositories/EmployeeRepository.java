package com.businessapi.repositories;

import com.businessapi.entities.Employee;
import com.businessapi.entities.enums.EStatus;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long>
{
    Optional<Employee> findByIdAndMemberId(Long id, Long memberId);

    List<Employee> findAllByNameContainingIgnoreCaseAndMemberIdAndStatusIsNotOrderByNameAsc(String s, Long memberIdFromAuthenticatedMember, EStatus eStatus, PageRequest of);

    List<Employee> findAllByMemberIdAndStatusIsNot(Long memberId, EStatus eStatus);

    Optional<List<Employee>> findByMemberIdAndStatusNot(Long memberId, EStatus eStatus);

    Boolean existsByEmailIgnoreCase(String email);
}
