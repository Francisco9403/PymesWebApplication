package com.backend.app.model.dto;

import java.math.BigDecimal;

public record ProductImportDTO(
    String name,            // Cambiado de sku a name
    BigDecimal baseCostPrice,
    Integer quantity,
    String ean13            // Opcional
) {}