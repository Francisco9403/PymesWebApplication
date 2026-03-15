package com.backend.app.proveedor.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.app.proveedor.model.Supplier;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {

    // Búsqueda clave para no duplicar proveedores al cargarlos
    Optional<Supplier> findByCuit(String cuit);
}