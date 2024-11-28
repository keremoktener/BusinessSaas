package com.businessapi.repositories;

import com.businessapi.entity.Declaration;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface DeclarationRepository extends JpaRepository<Declaration, Long> {
    @Query("SELECT d FROM Declaration d WHERE d.taxType LIKE %:taxType%")
    Page<Declaration> findByTaxTypeContainingIgnoreCase(String taxType, Pageable pageable);

    List<Declaration> findAllByTaxType(String taxType);
}
