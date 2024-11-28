package com.businessapi.repository;



import com.businessapi.entity.Employee;
import com.businessapi.entity.Payroll;
import com.businessapi.utility.enums.EStatus;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee,Long > {
    List<Employee> findAllByFirstNameContainingIgnoreCaseAndStatusAndMemberIdOrderByFirstNameAsc(String s, EStatus status,Long memberId, PageRequest of);


    Long countByGenderAndStatusAndMemberId(String gender, EStatus status, Long memberId);



    List<Employee> findAllByMemberId(Long memberId);


    List<Employee> findAllByStatusAndMemberId(EStatus eStatus, Long memberIdFromAuthenticatedMember);

}
