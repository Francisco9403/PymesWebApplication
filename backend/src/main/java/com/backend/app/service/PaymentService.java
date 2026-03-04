package com.backend.app.service;

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
        Payment payment = paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new BusinessException(0L)); // ID de transacción no encontrado

        payment.setStatus(newStatus);

        // Futuro: Si el status es APPROVED, acá se dispara la lógica para generar
        // el FiscalReceipt (Factura) conectándose a ARCA.

        return paymentRepository.save(payment);
    }
}