package com.businessapi.repositories;

import com.businessapi.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    Department findDepartmentByNameAndMemberId (String departmentName, Long memberId);
    List<Department> findAllByMemberId(Long memberId);

    Department findDepartmentByName(String departmentName);
}
