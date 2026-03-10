package com.backend.app.model;

public enum PaymentMethod {
    RESPONSABLE_INSCRIPTO, // Emite A o B, discrimina IVA
    MONOTRIBUTO,           // Emite C
    EXENTO,                // Instituciones exentas de IVA
    CONSUMIDOR_FINAL,      // El cliente estándar de a pie
    SUJETO_NO_CATEGORIZADO,
    PROVEEDOR_DEL_EXTERIOR // Para importaciones (si aplica)
}
