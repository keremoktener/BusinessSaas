package com.businessapi.repositories;


import com.businessapi.entities.Supplier;
import com.businessapi.entities.enums.EStatus;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SupplierRepository extends JpaRepository<Supplier, Long>
{
    List<Supplier> findAllByNameContainingIgnoreCaseAndMemberIdAndStatusIsNotOrderByNameAsc(String s, Long memberId, EStatus status, PageRequest of);

    Optional<Supplier> findByAuthId(Long authId);

    Optional<Supplier> findByEmail(String email);

    Optional<Supplier> findByIdAndMemberId(Long id,Long memberId);
}
