package com.businessapi.service;


import com.businessapi.dto.request.EmployeeSaveRequestDTO;
import com.businessapi.dto.request.EmployeeUpdateRequestDTO;
import com.businessapi.dto.response.BirthDateResponseDTO;
import com.businessapi.dto.response.EmployeeResponseDTO;
import com.businessapi.dto.response.PageRequestDTO;
import com.businessapi.entity.Employee;
import com.businessapi.exception.HRMException;
import com.businessapi.exception.ErrorType;
import com.businessapi.repository.EmployeeRepository;
import com.businessapi.utility.SessionManager;
import com.businessapi.utility.enums.EStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeService {
    private final EmployeeRepository employeeRepository;

    public  Boolean save(EmployeeSaveRequestDTO dto) {
        Employee employee=Employee.builder()
                .firstName(dto.firstName())
                .lastName(dto.lastName())
                .phone(dto.phone())
                .email(dto.email())
                .position(dto.position())
                .salary(dto.salary())
                .gender(dto.gender().toUpperCase())
                .department(dto.department())
                .birthDate(dto.birthDate())
                .hireDate(dto.hireDate())
                .status(EStatus.ACTIVE)
                .memberId(SessionManager.getMemberIdFromAuthenticatedMember())
                .build();
        employeeRepository.save(employee);
        return true;
    }
    public void saveForDemoData(EmployeeSaveRequestDTO dto) {
        Employee employee=Employee.builder()
                .firstName(dto.firstName())
                .lastName(dto.lastName())
                .phone(dto.phone())
                .email(dto.email())
                .position(dto.position())
                .salary(dto.salary())
                .department(dto.department())
                .gender(dto.gender())
                .birthDate(dto.birthDate())
                .hireDate(dto.hireDate())
                .status(EStatus.ACTIVE)
                .memberId(2L)
                .build();
        employeeRepository.save(employee);

    }

    public Boolean update(EmployeeUpdateRequestDTO dto) {
        Employee employee = employeeRepository.findById(dto.id()).orElseThrow(() -> new HRMException(ErrorType.NOT_FOUNDED_EMPLOYEE));
        employee.setFirstName(dto.firstName()!=null?dto.firstName(): employee.getFirstName());
        employee.setLastName(dto.lastName()!=null?dto.lastName(): employee.getLastName());
        employee.setPhone(dto.phone()!=null?dto.phone():employee.getPhone());
        employee.setEmail(dto.email()!=null?dto.email():employee.getEmail());
        employee.setGender(dto.gender()!=null?dto.gender():employee.getGender());
        employee.setPosition(dto.position()!=null?dto.position():employee.getPosition());
        employee.setSalary(dto.salary()!=null?dto.salary():employee.getSalary());
        employee.setBirthDate(dto.birthDate()!=null?dto.birthDate():employee.getBirthDate());
        employee.setDepartment(dto.department()!=null?dto.department():employee.getDepartment());
        employee.setHireDate(dto.hireDate()!=null?dto.hireDate():employee.getHireDate());
        employeeRepository.save(employee);
        return true;

    }

    public EmployeeResponseDTO findById(Long id) {
        Employee employee = employeeRepository.findById(id).orElseThrow(() -> new HRMException(ErrorType.NOT_FOUNDED_EMPLOYEE));
        return EmployeeResponseDTO.builder()
               .firstName(employee.getFirstName())
               .lastName(employee.getLastName())
               .phone(employee.getPhone())
               .email(employee.getEmail())
               .position(employee.getPosition())
               .salary(employee.getSalary())
                .birthDate(employee.getBirthDate())
                .gender(employee.getGender())
               .department(employee.getDepartment())
               .hireDate(employee.getHireDate())
               .build();

    }



    public List<Employee> searchByName(PageRequestDTO dto) {
        return employeeRepository.findAllByFirstNameContainingIgnoreCaseAndStatusAndMemberIdOrderByFirstNameAsc(dto.searchText(), EStatus.ACTIVE, SessionManager.getMemberIdFromAuthenticatedMember(), PageRequest.of(dto.page(), dto.size()));

    }

    public Boolean delete(Long id) {
        Employee employee = employeeRepository.findById(id).orElseThrow(() -> new HRMException(ErrorType.NOT_FOUNDED_EMPLOYEE));
        employee.setStatus(EStatus.PASSIVE);
        employeeRepository.save(employee);
        return true;


    }

    public Long numberOfEmployeeMen () {
        return employeeRepository.countByGenderAndStatusAndMemberId("ERKEK", EStatus.ACTIVE, SessionManager.getMemberIdFromAuthenticatedMember());
    }
    public Long numberOfEmployeeWomen () {
        return employeeRepository.countByGenderAndStatusAndMemberId("KADIN", EStatus.ACTIVE, SessionManager.getMemberIdFromAuthenticatedMember());
    }

    public Map<String, Long> numberOfEmployeesInDepartments (){
        List<Employee> employees = employeeRepository.findAllByMemberId(SessionManager.getMemberIdFromAuthenticatedMember());
        Map<String, Long> departmentCount = employees.stream()
                .collect(Collectors.groupingBy(Employee::getDepartment, Collectors.counting()));

      return departmentCount;
    }



// ...

    public List<BirthDateResponseDTO> findUpcomingBirthdays() {
        LocalDate today = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");

        List<Employee> employees = employeeRepository.findAllByStatusAndMemberId(EStatus.ACTIVE, SessionManager.getMemberIdFromAuthenticatedMember());
        return employees.stream()
                .filter(e -> e.getBirthDate() != null)
                .sorted((e1, e2) -> {
                    LocalDate birthDate1 = e1.getBirthDate().withYear(today.getYear());
                    LocalDate birthDate2 = e2.getBirthDate().withYear(today.getYear());
                    if (birthDate1.isBefore(today)) {
                        birthDate1 = birthDate1.plusYears(1);
                    }
                    if (birthDate2.isBefore(today)) {
                        birthDate2 = birthDate2.plusYears(1);
                    }

                    return birthDate1.compareTo(birthDate2);
                })
                .map(e -> BirthDateResponseDTO.builder()
                        .firstName(e.getFirstName())
                        .lastName(e.getLastName())
                        .birthDate(e.getBirthDate().format(formatter))
                        .build())
                .collect(Collectors.toList());
    }


}



