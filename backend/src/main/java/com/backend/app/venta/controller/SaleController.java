package com.backend.app.venta.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.backend.app.venta.model.Sale;
import com.backend.app.venta.model.dto.CreateSaleRequest;
import com.backend.app.venta.service.SaleService;

import jakarta.validation.Valid; // 🚀 Importación necesaria

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
    public void createSale(@Valid @RequestBody CreateSaleRequest request) {
        saleService.createSale(request);
    }
}