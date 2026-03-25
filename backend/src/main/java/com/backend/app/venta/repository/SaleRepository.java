package com.backend.app.venta.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph; // 🚀 Importado
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.app.venta.model.Sale;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {

    @EntityGraph(attributePaths = {"customer", "branch"})
    List<Sale> findByBranchId(Long branchId);

    @EntityGraph(attributePaths = {"branch", "fiscalReceipt", "customer"})
    List<Sale> findByCreatedAtBetweenAndFiscalReceiptIsNotNull(LocalDateTime start, LocalDateTime end);

    @EntityGraph(attributePaths = {"branch"})
    Page<Sale> findByCustomer_Id(Long customerId, Pageable pageable);

    @EntityGraph(attributePaths = {"customer", "branch"})
    Optional<Sale> findTopByOrderByIdDesc();
}