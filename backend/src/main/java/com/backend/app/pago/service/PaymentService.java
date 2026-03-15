package com.backend.app.pago.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory; // 🚀 Importaciones de SLF4J
import com.backend.app.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import com.backend.app.pago.model.Payment;
import com.backend.app.pago.model.PaymentStatus;
import com.backend.app.pago.repository.PaymentRepository;

@Service
public class PaymentService {

    // 🚀 Definición del Logger para auditar transacciones externas
    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public Payment processPaymentWebhook(String transactionId, PaymentStatus newStatus) {
        log.info("Webhook recibido: Procesando actualización para Transacción ID: {} -> Nuevo Estado: {}",
                transactionId, newStatus);

        Payment payment = paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> {
                    log.error(" Error en Webhook: Se recibió una notificación para una transacción inexistente: {}", transactionId);
                    return new ResourceNotFoundException("Pago no encontrado con transacción: " + transactionId);
                });

        PaymentStatus oldStatus = payment.getStatus();
        payment.setStatus(newStatus);

        Payment savedPayment = paymentRepository.save(payment);

        log.info(" Pago actualizado correctamente. ID Interno: {}. Estado anterior: {} -> Estado actual: {}",
                savedPayment.getId(), oldStatus, savedPayment.getStatus());

        // Futuro: Si el status es APPROVED, acá se dispara la lógica para generar
        // el FiscalReceipt (Factura) conectándose a ARCA.
        if (newStatus == PaymentStatus.APPROVED) {
            log.info("Pago aprobado. Listo para disparar facturación electrónica para la transacción: {}", transactionId);
        }

        return savedPayment;
    }
}