package com.backend.app.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.app.model.Payment;
import com.backend.app.model.PaymentStatus;
import com.backend.app.service.PaymentService;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // Este es el endpoint "fantasma" que van a llamar MODO/MercadoPago desde sus servidores
    @PostMapping("/webhook")
    public ResponseEntity<Payment> handleWebhook(
            @RequestParam String transactionId,
            @RequestParam PaymentStatus status) {

        Payment updatedPayment = paymentService.processPaymentWebhook(transactionId, status);
        return ResponseEntity.ok(updatedPayment);
    }
}