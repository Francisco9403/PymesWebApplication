package com.backend.app.proveedor.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.backend.app.proveedor.model.Supplier;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {

    // Búsqueda clave para no duplicar proveedores al cargarlos
    Optional<Supplier> findByCuit(String cuit);

    @Query("SELECT DISTINCT s FROM Supplier s " +
            "JOIN s.products p " +
            "JOIN p.stocks st " +
            "WHERE st.branch.id = :branchId")
    List<Supplier> findSuppliersByBranch(@Param("branchId") Long branchId);

    @Query("SELECT DISTINCT s FROM Supplier s " +
            "JOIN s.products p " +
            "JOIN p.stocks st " +
            "WHERE st.branch.id = :branchId")
    List<Supplier> findByBranchId(@Param("branchId") Long branchId);
}
