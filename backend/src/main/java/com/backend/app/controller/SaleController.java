package com.backend.app.controller;

import java.util.List;
import jakarta.validation.Valid; // 🚀 Importación necesaria
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.app.model.Sale;
import com.backend.app.model.dto.CreateSaleRequest;
import com.backend.app.service.SaleService;

@RestController
@RequestMapping("/api/sales")
public class SaleController {

    private final SaleService saleService;

    public SaleController(SaleService saleService) {
        this.saleService = saleService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sale> getSaleById(@PathVariable Long id) {
        return ResponseEntity.ok(saleService.getSaleById(id));
    }

    @GetMapping("/branch/{branchId}")
    public ResponseEntity<List<Sale>> getSalesByBranch(@PathVariable Long branchId) {
        return ResponseEntity.ok(saleService.getSalesByBranch(branchId));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void createSale(@Valid @RequestBody CreateSaleRequest request) { // 🚀 Agregado @Valid
        saleService.createSale(request);
    }
}