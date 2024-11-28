package com.businessapi.service;

import com.businessapi.dto.request.AttendanceSaveRequestDTO;
import com.businessapi.dto.request.PassCardSaveRequestDTO;
import com.businessapi.entity.PassCard;
import com.businessapi.exception.ErrorType;
import com.businessapi.exception.HRMException;
import com.businessapi.repository.AttendanceRepository;
import com.businessapi.repository.PassCardRepository;

import com.businessapi.utility.enums.EStatus;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class PassCardService {
    private final PassCardRepository passCardRepository;
    private final AttendanceService attendanceService;


    public Boolean save(PassCardSaveRequestDTO dto){
        PassCard passCard=PassCard.builder()
                .employeeId(dto.employeeId())
                .cardNumber(dto.cardNumber())
                .status(EStatus.ACTIVE)
                .build();
        passCardRepository.save(passCard);
        return true;
    }
    public List<PassCard> findAll(){
        return passCardRepository.findAll();
    }
    public Boolean delete(Long id){
        PassCard passCard = passCardRepository.findById(id).orElseThrow(() -> new HRMException(ErrorType.NOT_FOUNDED_PASSCARD));
        passCard.setStatus(EStatus.PASSIVE);
        passCardRepository.save(passCard);
        return true;
    }
    public  Boolean checkInTime(String cardNumber){
        PassCard passCard = passCardRepository.findByCardNumber(cardNumber).orElseThrow(() -> new HRMException(ErrorType.NOT_FOUNDED_PASSCARD));
        AttendanceSaveRequestDTO attendanceSaveRequestDTO=AttendanceSaveRequestDTO.builder()
                .employeeId(passCard.getEmployeeId())
                .date(LocalDate.now())
                .checkInTime(LocalTime.now())
                .build();
        attendanceService.save(attendanceSaveRequestDTO);

        return true;
    }
    public  Boolean checkOutTime(String cardNumber){
        PassCard passCard = passCardRepository.findByCardNumber(cardNumber).orElseThrow(() -> new HRMException(ErrorType.NOT_FOUNDED_PASSCARD));
        AttendanceSaveRequestDTO attendanceSaveRequestDTO=AttendanceSaveRequestDTO.builder()
                .employeeId(passCard.getEmployeeId())
                .date(LocalDate.now())
                .checkOutTime(LocalTime.now())
                .build();
        attendanceService.save(attendanceSaveRequestDTO);

        return true;
    }



}
