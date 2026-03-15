package com.backend.app.proveedor.controller;

import java.util.List;
import jakarta.validation.Valid; // 🚀 Importación necesaria
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.backend.app.proveedor.model.Supplier;
import com.backend.app.usuario.model.User;
import com.backend.app.proveedor.model.dto.SupplierImportDTO;
import com.backend.app.proveedor.service.SupplierService;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @PostMapping
    public ResponseEntity<Supplier> createSupplier(@Valid @RequestBody Supplier supplier) {
        Supplier createdSupplier = supplierService.createSupplier(supplier);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdSupplier);
    }

    @PostMapping("/import")
    @ResponseStatus(HttpStatus.OK)
    public void importFromOCR(@Valid @RequestBody SupplierImportDTO dto, Authentication auth) {
        User user = (User) auth.getPrincipal();
        supplierService.importFromOCR(dto, user.getId());
    }

    @GetMapping
    public ResponseEntity<List<Supplier>> getAllSuppliers() {
        return ResponseEntity.ok(supplierService.getAllSuppliers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Supplier> getSupplierById(@PathVariable Long id) {
        return ResponseEntity.ok(supplierService.getSupplierById(id));
    }
}