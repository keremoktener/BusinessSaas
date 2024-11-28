package com.businessapi.services;

import com.businessapi.dto.request.DepartmentSaveRequestDto;
import com.businessapi.dto.request.DepartmentUpdateRequestDto;
import com.businessapi.dto.request.PageRequestDTO;
import com.businessapi.entities.Department;
import com.businessapi.entities.enums.EStatus;
import com.businessapi.exception.ErrorType;
import com.businessapi.exception.OrganizationManagementServiceException;
import com.businessapi.repositories.DepartmentRepository;
import com.businessapi.util.SessionManager;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentService
{
    private final DepartmentRepository departmentRepository;

    public Boolean save(DepartmentSaveRequestDto dto)
    {
        if (departmentRepository.existsByNameIgnoreCaseAndMemberIdAndStatusIsNot(dto.name(), SessionManager.getMemberIdFromAuthenticatedMember(), EStatus.DELETED))
        {
            throw new OrganizationManagementServiceException(ErrorType.DEPARTMENT_ALREADY_EXIST);
        }

        departmentRepository.save(Department.builder().memberId(SessionManager.getMemberIdFromAuthenticatedMember()).name(dto.name()).build());
        return true;
    }

    public Boolean saveForDemoData(DepartmentSaveRequestDto dto)
    {
        departmentRepository.save(Department.builder().memberId(2L).name(dto.name()).build());
        return true;
    }


    public Boolean delete(Long id)
    {
        Department department = departmentRepository.findByIdAndMemberId(id, SessionManager.getMemberIdFromAuthenticatedMember()).orElseThrow(() -> new OrganizationManagementServiceException(ErrorType.DEPARTMENT_NOT_FOUND));
        department.setStatus(EStatus.DELETED);
        departmentRepository.save(department);
        return true;
    }

    public Boolean update(DepartmentUpdateRequestDto dto)
    {
        Department department = departmentRepository.findByIdAndMemberId(dto.id(), SessionManager.getMemberIdFromAuthenticatedMember()).orElseThrow(() -> new OrganizationManagementServiceException(ErrorType.DEPARTMENT_NOT_FOUND));
        department.setName(dto.name());
        departmentRepository.save(department);
        return true;
    }

    public List<Department> findAllByNameContainingIgnoreCaseAndMemberIdAndStatusIsNotOrderByNameAsc(PageRequestDTO dto)
    {
        return departmentRepository.findAllByNameContainingIgnoreCaseAndMemberIdAndStatusIsNotOrderByNameAsc(dto.searchText(), SessionManager.getMemberIdFromAuthenticatedMember(), EStatus.DELETED, PageRequest.of(dto.page(), dto.size()));
    }

    public Department findByIdAndMemberId(Long id)
    {
        return departmentRepository.findByIdAndMemberId(id, SessionManager.getMemberIdFromAuthenticatedMember()).orElseThrow(() -> new OrganizationManagementServiceException(ErrorType.DEPARTMENT_NOT_FOUND));
    }

    public Department findById(Long id)
    {
        return departmentRepository.findById(id).orElseThrow(() -> new OrganizationManagementServiceException(ErrorType.DEPARTMENT_NOT_FOUND));
    }
}
