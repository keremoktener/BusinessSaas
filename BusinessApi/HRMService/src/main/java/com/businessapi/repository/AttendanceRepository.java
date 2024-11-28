package com.businessapi.repository;

import com.businessapi.entity.Attendance;
import com.businessapi.utility.enums.EStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance,Long > {
    List<Attendance> findAllByStatus(EStatus eStatus);

}
