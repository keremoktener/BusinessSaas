package com.businessapi.services;

import com.businessapi.dto.request.SaveDepartmentRequestDTO;
import com.businessapi.dto.response.DepartmentResponseDTO;
import com.businessapi.entity.Department;
import com.businessapi.entity.enums.EStatus;
import com.businessapi.exception.ErrorType;
import com.businessapi.exception.FinanceServiceException;
import com.businessapi.repositories.DepartmentRepository;
import com.businessapi.util.SessionManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentService {
    private final DepartmentRepository departmentRepository;

    public List<DepartmentResponseDTO> getAllDepartments() {
        List<Department> departments = departmentRepository.findAllByMemberId(SessionManager.getMemberIdFromAuthenticatedMember());
        List<DepartmentResponseDTO> departmentResponseDTOS = new ArrayList<>();
        for (Department department : departments) {
            departmentResponseDTOS.add(new DepartmentResponseDTO(department.getId(), department.getName()));
        }
        return departmentResponseDTOS;
    }

    public Boolean saveDepartment(SaveDepartmentRequestDTO dto) {
        Department department = Department.builder()
                .name(dto.name())
                .memberId(SessionManager.getMemberIdFromAuthenticatedMember())
                .build();
        departmentRepository.save(department);
        return true;
    }

    public Boolean saveDepartmentForDemoData(SaveDepartmentRequestDTO dto) {
        Department department = Department.builder()
                .name(dto.name())
                .memberId(2L)
                .build();
        departmentRepository.save(department);
        return true;
    }

    public Boolean deleteDepartment(Long id) {
        departmentRepository.deleteById(id);
        return true;
    }

    public Department getDepartmentById(Long id) {
        return departmentRepository.findById(id).orElseThrow(() -> new FinanceServiceException(ErrorType.DEPARTMENT_NOT_FOUND));
    }

    public List<Department> findAll() {
        List<Department> departments = departmentRepository.findAll();
        departments.removeIf(department -> department.getStatus().equals(EStatus.DELETED));
        return departments;
    }

    public List<Department> findAllByMemberId(Long memberId) {
        List<Department> departments = departmentRepository.findAllByMemberId(memberId);
        departments.removeIf(department -> department.getStatus().equals(EStatus.DELETED));
        return departments;
    }

    public Department getDepartmentByNameAndMemberId(String departmentName, Long memberId) {
        return departmentRepository.findDepartmentByNameAndMemberId(departmentName, memberId);
    }

    public Department getDepartmentByName(String departmentName) {
        return departmentRepository.findDepartmentByName(departmentName);
    }
}
