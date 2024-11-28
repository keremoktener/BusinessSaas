package com.businessapi.repositories;


import com.businessapi.entities.ProductCategory;
import com.businessapi.entities.enums.EStatus;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long>
{
    List<ProductCategory> findAllByNameContainingIgnoreCaseAndMemberIdAndStatusIsNotOrderByNameAsc(String s, Long memberId, EStatus status,PageRequest of);

    Boolean existsByMemberIdAndNameIgnoreCase(Long memberId, String name);

    Optional<ProductCategory> findByIdAndMemberId(Long id, Long memberId);
}
