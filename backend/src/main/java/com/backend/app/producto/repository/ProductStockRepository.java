package com.backend.app.producto.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph; // 🚀 Importado
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.app.sucursal.model.Branch;
import com.backend.app.producto.model.Product;
import com.backend.app.producto.model.ProductStock;

@Repository
public interface ProductStockRepository extends JpaRepository<ProductStock, Long> {

    @EntityGraph(attributePaths = {"product", "branch.user"})
    List<ProductStock> findByProductId(Long productId);

    @EntityGraph(attributePaths = {"product", "branch.user"})
    List<ProductStock> findByBranchId(Long branchId);

    @EntityGraph(attributePaths = {"product", "branch.user"})
    Optional<ProductStock> findByProductIdAndBranchId(Long productId, Long branchId);
    long countByProductId(Long productId);

    @EntityGraph(attributePaths = {"product", "branch"})
    Optional<ProductStock> findByProductAndBranch(Product product, Branch branch);
}