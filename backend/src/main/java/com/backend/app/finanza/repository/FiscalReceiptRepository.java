package com.backend.app.finanza.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.app.finanza.model.FiscalReceipt;

@Repository
public interface FiscalReceiptRepository extends JpaRepository<FiscalReceipt, Long> {

    // Para buscar la factura asociada a una venta específica
    Optional<FiscalReceipt> findBySaleId(Long saleId);

    // Para validaciones o auditorías buscando por el Código de Autorización Electrónico
    Optional<FiscalReceipt> findByCae(String cae);
}