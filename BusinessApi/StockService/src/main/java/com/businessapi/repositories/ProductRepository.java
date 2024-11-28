package com.businessapi.repositories;


import com.businessapi.dto.response.ProductResponseDTO;
import com.businessapi.entities.Product;
import com.businessapi.entities.enums.EStatus;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long>
{
    @Query("SELECT new com.businessapi.dto.response.ProductResponseDTO(p.id, s.name, w.name, pc.name, p.name, p.description, p.price, p.stockCount, p.minimumStockLevel, p.isAutoOrderEnabled, p.createdAt, p.updatedAt, p.status) FROM Product p " +
            "JOIN Supplier s ON s.id = p.supplierId JOIN WareHouse w ON w.id = p.wareHouseId JOIN ProductCategory pc ON pc.id = p.productCategoryId " +
            "WHERE p.name ILIKE %:s% " +
            "AND p.memberId = :memberId " +
            "AND p.status = :status " +
            "ORDER BY p.name ASC")
    List<ProductResponseDTO> findAllByNameContainingIgnoreCaseAndStatusAndMemberIdOrderByName(String s, EStatus status, Long memberId, PageRequest of);
    @Query("SELECT p FROM Product p WHERE p.stockCount < p.minimumStockLevel AND p.status = :status AND p.memberId = :memberId AND p.name ILIKE %:name% ORDER BY p.name ASC")
    List<Product> findAllByMinimumStockLevelAndStatusAndNameContainingIgnoreCaseOrderByNameAsc(
            EStatus status, Long memberId, String name, PageRequest of);

    List<Product> findAllByNameContainingIgnoreCaseAndMemberIdAndStatusIsNotOrderByNameAsc(String name, Long memberId, EStatus status);


    List<Product> findAllByNameContainingIgnoreCaseAndMemberIdOrderByNameAsc(String name, Long memberId);


    @Query("SELECT p FROM Product p WHERE p.stockCount < p.minimumStockLevel AND p.status = :status")
    List<Product> findAllByMinimumStockLevelAndStatus(EStatus status);

    Optional<Product>  findByIdAndMemberId(Long id, Long memberId);
}
