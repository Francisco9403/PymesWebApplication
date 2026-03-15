package com.backend.app.pago.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.app.pago.model.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    // CRÍTICO para el Webhook: buscar el pago por el ID que devuelve MercadoPago/MODO
    Optional<Payment> findByTransactionId(String transactionId);
}