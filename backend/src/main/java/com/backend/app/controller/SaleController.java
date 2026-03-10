package com.backend.app.controller;

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

    // El frontend manda el carrito de compras acá
    @PostMapping
    public ResponseEntity<Sale> createSale(@RequestBody Sale sale) {
        Sale newSale = saleService.createSale(sale);
        return ResponseEntity.status(HttpStatus.CREATED).body(newSale);
    }

    // Para ver el ticket/detalle de una venta
    @GetMapping("/{id}")
    public ResponseEntity<Sale> getSaleById(@PathVariable Long id) {
        return ResponseEntity.ok(saleService.getSaleById(id));
    }

    // Para armar el cierre de caja de una sucursal
    @GetMapping("/branch/{branchId}")
    public ResponseEntity<List<Sale>> getSalesByBranch(@PathVariable Long branchId) {
        return ResponseEntity.ok(saleService.getSalesByBranch(branchId));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Sale createSale(@RequestBody CreateSaleRequest request) {
        return saleService.createSale(request);
    }
}