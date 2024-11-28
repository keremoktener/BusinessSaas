package com.businessapi.repository;


import com.businessapi.entity.Benefit;
import com.businessapi.utility.enums.EStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BenefitRepository extends JpaRepository<Benefit,Long > {
    List<Benefit> findAllByStatus(EStatus eStatus);

}
