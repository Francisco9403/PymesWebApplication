package com.backend.app.finanza.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.app.finanza.model.FiscalReceipt;
import com.backend.app.finanza.service.FiscalReceiptService;

@RestController
@RequestMapping("/api/receipts")
public class FiscalReceiptController {

    private final FiscalReceiptService fiscalReceiptService;

    public FiscalReceiptController(FiscalReceiptService fiscalReceiptService) {
        this.fiscalReceiptService = fiscalReceiptService;
    }

    // Endpoint para emitir el comprobante (A, B o C)
    @PostMapping
    public ResponseEntity<FiscalReceipt> createReceipt(@Valid @RequestBody FiscalReceipt receipt) {
        FiscalReceipt newReceipt = fiscalReceiptService.createReceipt(receipt);
        return ResponseEntity.status(HttpStatus.CREATED).body(newReceipt);
    }

    // Endpoint para que el frontend muestre el ticket o lo mande a imprimir
    @GetMapping("/sale/{saleId}")
    public ResponseEntity<FiscalReceipt> getReceiptBySale(@PathVariable Long saleId) {
        return ResponseEntity.ok(fiscalReceiptService.getReceiptBySale(saleId));
    }
}