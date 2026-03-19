package com.backend.app.finanza.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.app.finanza.model.PurchaseInvoice;
import com.backend.app.proveedor.model.Supplier;

public interface PurchaseInvoiceRepository extends JpaRepository<PurchaseInvoice, Long> {
    List<PurchaseInvoice> findByDateBetween(LocalDate from, LocalDate to);
    Optional<PurchaseInvoice> findTopBySupplierOrderByReceiptNumberDesc(Supplier supplier);
}
