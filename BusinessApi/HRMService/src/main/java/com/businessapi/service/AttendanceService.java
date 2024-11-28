package com.businessapi.service;

import com.businessapi.dto.request.AttendanceSaveRequestDTO;
import com.businessapi.dto.request.AttendanceUpdateRequestDTO;
import com.businessapi.dto.response.AttendanceResponseDTO;
import com.businessapi.dto.response.PageRequestDTO;
import com.businessapi.dto.response.PayrollResponseDTO;
import com.businessapi.entity.Attendance;
import com.businessapi.entity.Employee;
import com.businessapi.entity.Payroll;
import com.businessapi.exception.ErrorType;
import com.businessapi.exception.HRMException;
import com.businessapi.repository.AttendanceRepository;
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
public class AttendanceService {
    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;

    public Boolean save(AttendanceSaveRequestDTO dto) {
        Attendance attendance=Attendance.builder()
                .employeeId(dto.employeeId())
                .date(dto.date())
                .checkInTime(dto.checkInTime())
                .checkOutTime(dto.checkOutTime())
                .status(EStatus.ACTIVE)

        .build();
        attendanceRepository.save(attendance);
        return true;
    }

    public Boolean update(AttendanceUpdateRequestDTO dto) {
        Attendance attendance = attendanceRepository.findById(dto.id()).orElseThrow(() -> new HRMException(ErrorType.NOT_FOUNDED_ATTENDANCE));
        attendance.setDate(dto.date()!=null ? dto.date():attendance.getDate());
        attendance.setCheckOutTime(dto.checkOutTime()!=null ? dto.checkOutTime():attendance.getCheckOutTime());
        attendance.setCheckInTime(dto.checkInTime()!=null ? dto.checkInTime():attendance.getCheckInTime());
        attendanceRepository.save(attendance);
        return true;
    }

    public AttendanceResponseDTO findById(Long id) {
        Attendance attendance = attendanceRepository.findById(id).orElseThrow(() -> new HRMException(ErrorType.NOT_FOUNDED_ATTENDANCE));
        return AttendanceResponseDTO.builder()
               .employeeId(attendance.getEmployeeId())
                .date(attendance.getDate())
               .checkInTime(attendance.getCheckInTime())
               .checkOutTime(attendance.getCheckOutTime())
               .build();
    }



    public List<AttendanceResponseDTO> findAll(PageRequestDTO dto) {

        int page = dto.page();
        int size = dto.size();
        String searchText = dto.searchText();


        Pageable pageable = PageRequest.of(page, size);


        List<Attendance> attendances = attendanceRepository.findAllByStatus(EStatus.ACTIVE);


        List<AttendanceResponseDTO> attendanceResponseDTOList = new ArrayList<>();


        List<AttendanceResponseDTO> finalAttendanceResponseDTOList = attendanceResponseDTOList;
        attendances.forEach(attendance -> {
            Employee employee = employeeRepository.findById(attendance.getEmployeeId())
                    .orElseThrow(() -> new HRMException(ErrorType.NOT_FOUNDED_EMPLOYEE));

            AttendanceResponseDTO attendanceResponseDTO = AttendanceResponseDTO.builder()
                    .id(attendance.getId())
                    .employeeId(attendance.getEmployeeId())
                    .firstName(employee.getFirstName())
                    .lastName(employee.getLastName())
                    .date(attendance.getDate())
                    .checkInTime(attendance.getCheckInTime())
                    .checkOutTime(attendance.getCheckOutTime())
                    .build();


            finalAttendanceResponseDTOList.add(attendanceResponseDTO);
        });


        if (searchText != null && !searchText.isEmpty()) {
            attendanceResponseDTOList = attendanceResponseDTOList.stream()
                    .filter(payrollDto -> payrollDto.firstName().toLowerCase().contains(searchText.toLowerCase()) ||
                            payrollDto.lastName().toLowerCase().contains(searchText.toLowerCase()))
                    .collect(Collectors.toList());
        }


        int start = Math.min((int) pageable.getOffset(), attendanceResponseDTOList.size());
        int end = Math.min(start + pageable.getPageSize(), attendanceResponseDTOList.size());
        return attendanceResponseDTOList.subList(start, end);
    }

    public Boolean delete(Long id) {
        Attendance attendance = attendanceRepository.findById(id).orElseThrow(() -> new HRMException(ErrorType.NOT_FOUNDED_ATTENDANCE));
        attendance.setStatus(EStatus.PASSIVE);
        attendanceRepository.save(attendance);
        return true;

    }
}
