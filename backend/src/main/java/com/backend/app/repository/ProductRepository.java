package com.backend.app.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.backend.app.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    // Preparado para el escáner del mostrador (POS)
    Optional<Product> findByEan13(String ean13);

    // Por si buscan por el código interno
    Optional<Product> findBySku(String sku);

    Page<Product> findAll(Pageable pageable);

    Optional<Product> findByName(String name);
}