package com.backend.app.pago.model;

public enum PaymentStatus {
    PENDING,        // QR generado, esperando que el cliente escanee
    PROCESSING,     // Pago detectado pero pendiente de acreditación (ej. transferencia)
    APPROVED,       // Webhook confirmado (Venta cerrada exitosamente)
    REJECTED,       // Error en la transacción o fondos insuficientes
    EXPIRED,        // El QR dinámico tiene un TTL (Time-To-Live) y el cliente no pagó
    REFUNDED,       // Venta anulada y dinero devuelto
    PARTIALLY_PAID  // Para pagos mixtos (efectivo + transferencia)
}
