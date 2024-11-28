package com.businessapi.repositories;


import com.businessapi.entities.Order;
import com.businessapi.entities.StockMovement;
import com.businessapi.entities.enums.EStatus;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StockMovementRepository extends JpaRepository<StockMovement, Long>
{
    List<StockMovement> findAllByProductIdInAndStatusIsNot(List<Long> productIdList, EStatus status, PageRequest of);

    Optional<StockMovement> findByIdAndMemberId(Long id, Long memberId);
}
