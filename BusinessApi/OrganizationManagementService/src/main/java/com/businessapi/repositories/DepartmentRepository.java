package com.businessapi.repositories;

import com.businessapi.entities.Department;
import com.businessapi.entities.enums.EStatus;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DepartmentRepository extends JpaRepository<Department, Long>
{


    Optional<Department> findByIdAndMemberId(Long id, Long memberId);

    List<Department> findAllByNameContainingIgnoreCaseAndMemberIdAndStatusIsNotOrderByNameAsc(String name, Long memberId, EStatus status, PageRequest pageable);

    Boolean existsByNameIgnoreCaseAndMemberIdAndStatusIsNot(String name, Long memberIdFromAuthenticatedMember, EStatus status);
}
