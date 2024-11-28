package com.businessapi.repositories;

import com.businessapi.entity.Tax;
import com.businessapi.entity.enums.EStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaxRepository extends JpaRepository<Tax, Long> {
    Page<Tax> findAllByStatusNot(EStatus status, Pageable pageable);

}

