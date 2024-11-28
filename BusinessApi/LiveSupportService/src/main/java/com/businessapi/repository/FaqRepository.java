package com.businessapi.repository;

import com.businessapi.entity.Faq;
import com.businessapi.entity.enums.EStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FaqRepository extends JpaRepository<Faq, Long> {
    List<Faq> findAllByStatus(EStatus eStatus);
}