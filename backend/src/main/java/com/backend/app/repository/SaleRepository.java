package com.backend.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.app.model.Sale;
import com.backend.app.model.SaleStatus;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {
    // Para ver to do lo que vendió una sucursal en el día
    List<Sale> findByBranchId(Long branchId);

    // Para filtrar ventas pendientes de pago o canceladas
    List<Sale> findByStatus(SaleStatus status);
}