package com.businessapi.service;


import com.businessapi.dto.request.PerformanceSaveRequestDTO;
import com.businessapi.dto.request.PerformanceUpdateRequestDTO;
import com.businessapi.dto.response.DepartmentScoreResponseDTO;
import com.businessapi.dto.response.PageRequestDTO;
import com.businessapi.dto.response.PayrollResponseDTO;
import com.businessapi.dto.response.PerformanceResponseDTO;
import com.businessapi.entity.Employee;
import com.businessapi.entity.Payroll;
import com.businessapi.entity.Performance;
import com.businessapi.exception.ErrorType;
import com.businessapi.exception.HRMException;
import com.businessapi.repository.EmployeeRepository;
import com.businessapi.repository.PerformanceRepository;
import com.businessapi.utility.enums.EStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PerformanceService {
    private final PerformanceRepository performanceRepository;
    private final EmployeeRepository employeeRepository;

    public Boolean save(PerformanceSaveRequestDTO dto) {
        Performance performance= Performance.builder()
                .employeeId(dto.employeeId())
                .date(dto.date())
                .score(dto.score())
                .feedback(dto.feedback())
                .status(EStatus.ACTIVE)
                .build();
        performanceRepository.save(performance);
        return true;
    }

    public Boolean update(PerformanceUpdateRequestDTO dto) {
        Performance performance = performanceRepository.findById(dto.id()).orElseThrow(() -> new HRMException(ErrorType.NOT_FOUNDED_PERFORMANCE));
        performance.setDate(dto.date()!=null?dto.date():performance.getDate());
        performance.setScore(dto.score()!=null?dto.score():performance.getScore());
        performance.setFeedback(dto.feedback()!=null?dto.feedback():performance.getFeedback());
        performanceRepository.save(performance);
        return true;
    }

    public PerformanceResponseDTO findById(Long id) {
        Performance performance = performanceRepository.findById(id).orElseThrow(() -> new HRMException(ErrorType.NOT_FOUNDED_PERFORMANCE));
        return PerformanceResponseDTO.builder()
               .employeeId(performance.getEmployeeId())
               .date(performance.getDate())
               .score(performance.getScore())
               .feedback(performance.getFeedback())
               .build();
    }



    public List<PerformanceResponseDTO> findAll(PageRequestDTO dto) {

        int page = dto.page();
        int size = dto.size();
        String searchText = dto.searchText();


        Pageable pageable = PageRequest.of(page, size);


        List<Performance> performances = performanceRepository.findAllByStatus(EStatus.ACTIVE);


        List<PerformanceResponseDTO> performanceResponseDTOList = new ArrayList<>();


        List<PerformanceResponseDTO> finalPerformanceResponseDTOList = performanceResponseDTOList;
        performances.forEach(performance -> {
            Employee employee = employeeRepository.findById(performance.getEmployeeId())
                    .orElseThrow(() -> new HRMException(ErrorType.NOT_FOUNDED_EMPLOYEE));

            PerformanceResponseDTO performanceResponseDTO = PerformanceResponseDTO.builder()
                    .id(performance.getId())
                    .employeeId(performance.getEmployeeId())
                    .firstName(employee.getFirstName())
                    .lastName(employee.getLastName())
                    .date(performance.getDate())
                    .score(performance.getScore())
                    .feedback(performance.getFeedback())
                    .build();


            finalPerformanceResponseDTOList.add(performanceResponseDTO);
        });


        if (searchText != null && !searchText.isEmpty()) {
            performanceResponseDTOList = performanceResponseDTOList.stream()
                    .filter(payrollDto -> payrollDto.firstName().toLowerCase().contains(searchText.toLowerCase()) ||
                            payrollDto.lastName().toLowerCase().contains(searchText.toLowerCase()))
                    .collect(Collectors.toList());
        }


        int start = Math.min((int) pageable.getOffset(), performanceResponseDTOList.size());
        int end = Math.min(start + pageable.getPageSize(), performanceResponseDTOList.size());
        return performanceResponseDTOList.subList(start, end);
    }


    public Boolean delete(Long id) {
        Performance performance = performanceRepository.findById(id).orElseThrow(() -> new HRMException(ErrorType.NOT_FOUNDED_PERFORMANCE));
        performance.setStatus(EStatus.PASSIVE);
        performanceRepository.save(performance);
        return true;
    }

    public List<DepartmentScoreResponseDTO> getDepartmentAverageScores() {

        List<Performance> performances = performanceRepository.findAllByStatus(EStatus.ACTIVE);


        Map<String, List<Performance>> departmentMap = performances.stream()
                .collect(Collectors.groupingBy(performance -> {
                    Employee employee = employeeRepository.findById(performance.getEmployeeId())
                            .orElseThrow(() -> new HRMException(ErrorType.NOT_FOUNDED_EMPLOYEE));
                    return employee.getDepartment();
                }));


        List<DepartmentScoreResponseDTO> departmentScores = new ArrayList<>();
        departmentMap.forEach((department, performanceList) -> {
            double averageScore = performanceList.stream()
                    .mapToInt(Performance::getScore)
                    .average()
                    .orElse(0.0);

            departmentScores.add(DepartmentScoreResponseDTO.builder()
                    .department(department)
                    .averageScore(averageScore)
                    .build());
        });

        return departmentScores;
    }

}
