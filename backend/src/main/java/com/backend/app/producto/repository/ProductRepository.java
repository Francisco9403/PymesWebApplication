package com.backend.app.producto.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.backend.app.producto.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    @EntityGraph(attributePaths = {"user"}) // Trae el usuario en el mismo viaje
    Optional<Product> findByEan13(String ean13);

    @EntityGraph(attributePaths = {"user"})
    Optional<Product> findBySku(String sku);

    @Override
    @EntityGraph(attributePaths = {"user"})
    Page<Product> findAll(Pageable pageable);

    @EntityGraph(attributePaths = {"user"})
    Optional<Product> findByName(String name);

    @EntityGraph(attributePaths = {"user"})
    Optional<Product> findByIdAndUserId(Long id, Long userId);

    @EntityGraph(attributePaths = {"user"})
    List<Product> findByUserIdAndIgnoreStrategicRulesFalse(Long userId);

    @EntityGraph(attributePaths = {"user"})
    Optional<Product> findByNameAndUserId(String name, Long userId);

    long countBySkuStartingWith(String base);

    @Query("SELECT DISTINCT p FROM Product p " +
            "LEFT JOIN FETCH p.suppliers s " +
            "LEFT JOIN FETCH p.user " +
            "WHERE s.id = :supplierId")
    List<Product> findBySupplierId(@Param("supplierId") Long supplierId);

    @Query("SELECT DISTINCT p FROM Product p " +
            "JOIN FETCH p.suppliers s " +
            "JOIN FETCH p.stocks st " +
            "LEFT JOIN FETCH p.user " +
            "WHERE s.id = :supplierId AND st.branch.id = :branchId")
    List<Product> findBySupplierIdAndBranchId(
            @Param("supplierId") Long supplierId,
            @Param("branchId") Long branchId);
}