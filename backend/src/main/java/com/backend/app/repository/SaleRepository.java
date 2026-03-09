package com.backend.app.repository;

import com.backend.app.model.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {
    List<Sale> findByBranchId(Long branchId);

    // Buscamos ventas que tengan un comprobante fiscal y estén en un rango de fechas
    List<Sale> findByCreatedAtBetweenAndFiscalReceiptIsNotNull(LocalDateTime start, LocalDateTime end);}