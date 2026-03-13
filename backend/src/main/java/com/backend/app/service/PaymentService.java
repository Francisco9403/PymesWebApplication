package com.backend.app.service;

import com.backend.app.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import com.backend.app.model.Payment;
import com.backend.app.model.PaymentStatus;
import com.backend.app.repository.PaymentRepository;
import com.backend.app.exception.BusinessException;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public Payment processPaymentWebhook(String transactionId, PaymentStatus newStatus) {
        // 🚀 Cambio: ResourceNotFoundException (404) en lugar de BusinessException
        Payment payment = paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Pago no encontrado con transacción: " + transactionId));

        payment.setStatus(newStatus);
        return paymentRepository.save(payment);
    }
}