package com.businessapi.repositories;

import com.businessapi.dto.response.SupplierOrderResponseDTO;
import com.businessapi.entities.Order;
import com.businessapi.entities.Supplier;
import com.businessapi.entities.enums.EOrderType;
import com.businessapi.entities.enums.EStatus;
import jakarta.activation.DataContentHandler;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long>
{
    List<Order> findAllByProductIdInAndMemberIdAndStatusIsNotAndOrderType(List<Long> ids,Long memberId,EStatus status, EOrderType orderType, PageRequest of);

    @Query("SELECT new com.businessapi.dto.response.SupplierOrderResponseDTO(o.id, p.name, o.unitPrice, o.quantity, o.total, o.orderType, o.createdAt, o.status) FROM Order o " +
            "JOIN Product p ON o.supplierId = p.supplierId " +
            "WHERE p.name ILIKE %:name% " +
            "AND o.supplierId = :supplierId " +
            "AND o.status != :status " +
            "ORDER BY p.name ASC")
    List<SupplierOrderResponseDTO> findAllByProductNameContainingIgnoreCaseAndsupplierIdAndStatusNot(
            @Param("name") String name,
            @Param("supplierId") Long supplierId,
            @Param("status") EStatus status,
            PageRequest of);

    Optional<Order> findByIdAndMemberId(Long id, Long memberId);

}
