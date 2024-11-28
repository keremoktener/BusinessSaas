package com.businessapi.repositories;

import com.businessapi.entity.Invoice;
import com.businessapi.entity.enums.EInvoiceStatus;
import com.businessapi.entity.enums.EStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    Page<Invoice> findAllByStatusNot(EStatus status, Pageable pageable);
    Page<Invoice> findAllByMemberIdAndStatusNot(Long memberId, EStatus status, Pageable pageable);
    @Query("SELECT i FROM Invoice i WHERE i.productName LIKE %:productName% AND i.status != :status")
    Page<Invoice> findByProductNameContainingIgnoreCaseAndStatusNot(@Param("productName") String productName, @Param("status") EStatus status, Pageable pageable);

}
