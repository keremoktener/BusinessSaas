package com.businessapi.repository;




import com.businessapi.entity.Payroll;
import com.businessapi.utility.enums.EStatus;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PayrollRepository extends JpaRepository<Payroll,Long > {

    List<Payroll> findAllByStatus(EStatus eStatus);

}
