package com.businessapi.service;


import com.businessapi.dto.request.BenefitSaveRequestDTO;
import com.businessapi.dto.request.BenefitUpdateRequestDTO;
import com.businessapi.dto.response.BenefitResponseDTO;
import com.businessapi.dto.response.PageRequestDTO;
import com.businessapi.dto.response.PayrollResponseDTO;
import com.businessapi.entity.Benefit;
import com.businessapi.entity.Employee;
import com.businessapi.entity.Payroll;
import com.businessapi.exception.HRMException;
import com.businessapi.exception.ErrorType;
import com.businessapi.repository.BenefitRepository;
import com.businessapi.repository.EmployeeRepository;
import com.businessapi.utility.enums.EStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BenefitService {
    private final BenefitRepository benefitRepository;
    private final EmployeeRepository employeeRepository;

    public Boolean save(BenefitSaveRequestDTO dto) {
        Benefit benefit=Benefit.builder()
                .employeeId(dto.employeeId())
                .type(dto.type())
                .amount(dto.amount())
                .endDate(dto.endDate())
                .startDate(dto.startDate())
                .status(EStatus.ACTIVE)
                .build();
        benefitRepository.save(benefit);
        return true;
    }

    public Boolean update(BenefitUpdateRequestDTO dto) {
        Benefit benefit = benefitRepository.findById(dto.id()).orElseThrow(() -> new HRMException(ErrorType.NOT_FOUNDED_BENEFIT));
        benefit.setType(dto.type()!=null ? dto.type():benefit.getType());
        benefit.setAmount(dto.amount()!=null ? dto.amount():benefit.getAmount());
        benefit.setEndDate(dto.endDate()!=null ? dto.endDate():benefit.getEndDate());
        benefit.setStartDate(dto.startDate()!=null ? dto.startDate():benefit.getStartDate());
        benefitRepository.save(benefit);
        return true;
    }

    public BenefitResponseDTO findById(Long id) {
        Benefit benefit = benefitRepository.findById(id).orElseThrow(() -> new HRMException(ErrorType.NOT_FOUNDED_BENEFIT));
        return BenefitResponseDTO.builder()
                .amount(benefit.getAmount())
                .endDate(benefit.getEndDate())
                .employeeId(benefit.getEmployeeId())
                .startDate(benefit.getStartDate())
                .type(benefit.getType())
                .build();
    }



    public List<BenefitResponseDTO> findAll(PageRequestDTO dto) {

        int page = dto.page();
        int size = dto.size();
        String searchText = dto.searchText();


        Pageable pageable = PageRequest.of(page, size);


        List<Benefit> benefits = benefitRepository.findAllByStatus(EStatus.ACTIVE);


        List<BenefitResponseDTO> benefitResponseDTOList = new ArrayList<>();


        List<BenefitResponseDTO> finalBenefitResponseDTOList = benefitResponseDTOList;
        benefits.forEach(benefit -> {
            Employee employee = employeeRepository.findById(benefit.getEmployeeId())
                    .orElseThrow(() -> new HRMException(ErrorType.NOT_FOUNDED_EMPLOYEE));

            BenefitResponseDTO benefitResponseDTO = BenefitResponseDTO.builder()
                    .id(benefit.getId())
                    .employeeId(benefit.getEmployeeId())
                    .firstName(employee.getFirstName())
                    .lastName(employee.getLastName())
                    .amount(benefit.getAmount())
                    .endDate(benefit.getEndDate())
                    .startDate(benefit.getStartDate())
                    .type(benefit.getType())

                    .build();


            finalBenefitResponseDTOList.add(benefitResponseDTO);
        });


        if (searchText != null && !searchText.isEmpty()) {
            benefitResponseDTOList = benefitResponseDTOList.stream()
                    .filter(payrollDto -> payrollDto.firstName().toLowerCase().contains(searchText.toLowerCase()) ||
                            payrollDto.lastName().toLowerCase().contains(searchText.toLowerCase()))
                    .collect(Collectors.toList());
        }


        int start = Math.min((int) pageable.getOffset(), benefitResponseDTOList.size());
        int end = Math.min(start + pageable.getPageSize(), benefitResponseDTOList.size());
        return benefitResponseDTOList.subList(start, end);
    }


    public Boolean delete(Long id) {
        Benefit benefit = benefitRepository.findById(id).orElseThrow(() -> new HRMException(ErrorType.NOT_FOUNDED_BENEFIT));
        benefit.setStatus(EStatus.PASSIVE);
        benefitRepository.save(benefit);
        return true;
    }
}
