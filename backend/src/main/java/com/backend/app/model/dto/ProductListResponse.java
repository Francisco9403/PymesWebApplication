package com.backend.app.model.dto;

import java.math.BigDecimal;

public record ProductListResponse(
        Long id,
        String sku,
        String name,
        BigDecimal baseCostPrice,
        BigDecimal currentSalePrice,
        Integer totalStock,
        Integer minStock,
        Boolean isLowStock,
        // --- AGREGAR ESTO ---
        BigDecimal strategicMultiplier,
        String strategicReason,
        boolean ignoreStrategicRules
) {}