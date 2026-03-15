package com.backend.app.archivosParaRevisar;

public enum AlertType {
    STOCK_CRITICAL,      // Basado en velocidad de venta
    PRICE_REPOSITION,   // Precio proveedor > Precio venta
    CONTEXT_IA,         // Clima, feriados, estacionalidad
    PAYMENT_PENDING     // Webhook no recibido
}