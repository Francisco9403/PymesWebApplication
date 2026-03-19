package com.backend.app.venta.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.app.venta.model.Sale;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {
    List<Sale> findByBranchId(Long branchId);

    // Buscamos ventas que tengan un comprobante fiscal y estén en un rango de fechas
    List<Sale> findByCreatedAtBetweenAndFiscalReceiptIsNotNull(LocalDateTime start, LocalDateTime end);

    Page<Sale> findByCustomer_Id(Long customerId, Pageable pageable);

    Optional<Sale> findTopByOrderByIdDesc();
}