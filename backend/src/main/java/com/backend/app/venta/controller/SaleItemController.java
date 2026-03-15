package com.backend.app.venta.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.app.venta.dto.SaleItem;
import com.backend.app.venta.service.SaleItemService;

@RestController
@RequestMapping("/api/sale-items")
public class SaleItemController {

    private final SaleItemService saleItemService;

    public SaleItemController(SaleItemService saleItemService) {
        this.saleItemService = saleItemService;
    }

    // Trae el detalle puntual de un ítem vendido
    @GetMapping("/{id}")
    public ResponseEntity<SaleItem> getSaleItemById(@PathVariable Long id) {
        return ResponseEntity.ok(saleItemService.getSaleItemById(id));
    }

    // Trae to do el historial de ventas de un producto (para gráficos/reportes)
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<SaleItem>> getHistoryByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(saleItemService.getHistoryByProduct(productId));
    }
}