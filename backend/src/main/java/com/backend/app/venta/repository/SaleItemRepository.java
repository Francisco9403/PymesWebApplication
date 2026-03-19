package com.backend.app.venta.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.app.venta.model.SaleItem;

@Repository
public interface SaleItemRepository extends JpaRepository<SaleItem, Long> {

    // Ideal para analítica: ver el historial de ventas de un producto en particular
    List<SaleItem> findByProductId(Long productId);
}