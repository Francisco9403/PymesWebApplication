package com.backend.app.proveedor.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.backend.app.proveedor.model.Supplier;
import com.backend.app.proveedor.model.dto.SupplierImportDTO;
import com.backend.app.proveedor.service.SupplierService;
import com.backend.app.usuario.model.User;

import jakarta.validation.Valid;

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
    public ResponseEntity<List<Supplier>> getAllSuppliers(
            @RequestParam(required = false) Long branchId
    ) {
        // 🚀 Llamamos al nuevo método del service que ya tiene el escudo anti-nulos
        return ResponseEntity.ok(supplierService.getSuppliersByBranch(branchId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Supplier> getSupplierById(@PathVariable Long id) {
        return ResponseEntity.ok(supplierService.getSupplierById(id));
    }
}