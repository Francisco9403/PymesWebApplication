package com.backend.app.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.backend.app.model.ProductStock;
import com.backend.app.service.ProductStockService;

@RestController
@RequestMapping("/api/stock")
public class ProductStockController {

    private final ProductStockService productStockService;

    public ProductStockController(ProductStockService productStockService) {
        this.productStockService = productStockService;
    }

    // Actualiza un registro de stock
    @PatchMapping
    @ResponseStatus(HttpStatus.OK)
    public void saveStock(@RequestBody ProductStock productStock) {
        productStockService.updateStockQuantity(productStock);
    }

    // Trae el stock de un producto en todas las sucursales
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductStock>> getStockByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(productStockService.getStockByProduct(productId));
    }

    // Trae to do el catálogo de una sucursal
    @GetMapping("/branch/{branchId}")
    public ResponseEntity<List<ProductStock>> getStockByBranch(@PathVariable Long branchId) {
        return ResponseEntity.ok(productStockService.getStockByBranch(branchId));
    }

    // Trae el stock de un producto específico en una sucursal específica
    @GetMapping("/product/{productId}/branch/{branchId}")
    public ResponseEntity<ProductStock> getSpecificStock(
            @PathVariable Long productId,
            @PathVariable Long branchId) {
        return ResponseEntity.ok(productStockService.getSpecificStock(productId, branchId));
    }
}