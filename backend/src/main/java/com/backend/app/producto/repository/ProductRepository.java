package com.backend.app.producto.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.backend.app.producto.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    // Preparado para el escáner del mostrador (POS)
    Optional<Product> findByEan13(String ean13);

    // Por si buscan por el código interno
    Optional<Product> findBySku(String sku);

    Page<Product> findAll(Pageable pageable);

    Optional<Product> findByName(String name);

    Optional<Product> findByIdAndUserId(Long id, Long userId);

    List<Product> findByUserIdAndIgnoreStrategicRulesFalse(Long userId);

    Optional<Product> findByNameAndUserId(String name, Long userId);

    long countBySkuStartingWith(String base);

    @Query("SELECT p FROM Product p JOIN p.suppliers s WHERE s.id = :supplierId")
    List<Product> findBySupplierId(@Param("supplierId") Long supplierId);

    @Query("SELECT DISTINCT p FROM Product p " +
            "JOIN p.suppliers s " +
            "JOIN p.stocks st " +
            "WHERE s.id = :supplierId AND st.branch.id = :branchId")
    List<Product> findBySupplierIdAndBranchId(
            @Param("supplierId") Long supplierId,
            @Param("branchId") Long branchId);

}