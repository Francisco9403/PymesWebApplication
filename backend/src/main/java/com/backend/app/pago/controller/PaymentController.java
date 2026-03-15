package com.backend.app.pago.controller;

import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.app.pago.model.Payment;
import com.backend.app.pago.model.PaymentStatus;
import com.backend.app.pago.service.PaymentService;

@RestController
@RequestMapping("/api/payments")
@Validated
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // Este es el endpoint "fantasma" que van a llamar MODO/MercadoPago desde sus servidores
    @PostMapping("/webhook")
    public ResponseEntity<Payment> handleWebhook(
            @NotBlank @RequestParam String transactionId, // 🚀 Validamos que no sea vacío
            @RequestParam PaymentStatus status) {

        Payment updatedPayment = paymentService.processPaymentWebhook(transactionId, status);
        return ResponseEntity.ok(updatedPayment);
    }
}