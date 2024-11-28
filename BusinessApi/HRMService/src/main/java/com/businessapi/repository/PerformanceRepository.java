package com.businessapi.repository;





import com.businessapi.entity.Performance;
import com.businessapi.utility.enums.EStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PerformanceRepository extends JpaRepository<Performance,Long > {
    List<Performance> findAllByStatus(EStatus eStatus);

}
