package com.backend.app.model;

public enum UserRole {
    ADMIN,          // Acceso total, configuración de ARCA y Markup
    MANAGER,        // Gestión de stock, reportes y alertas de IA
    SELLER,         // Punto de venta (POS), generación de QR y facturación
    WAREHOUSE_OP,   // Solo ingresos de mercadería y OCR
    AUDITOR         // Solo lectura para reportes contables
}
