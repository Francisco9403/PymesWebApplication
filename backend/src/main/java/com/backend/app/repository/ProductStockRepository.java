package com.backend.app.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.app.model.ProductStock;

@Repository
public interface ProductStockRepository extends JpaRepository<ProductStock, Long> {

    // Buscar todas las ubicaciones y cantidades de un producto específico
    List<ProductStock> findByProductId(Long productId);

    // Buscar to do el inventario que tiene una sucursal/depósito particular
    List<ProductStock> findByBranchId(Long branchId);

    // Buscar el registro exacto de un producto en una sucursal específica (ideal para descontar stock al vender)
    Optional<ProductStock> findByProductIdAndBranchId(Long productId, Long branchId);
}