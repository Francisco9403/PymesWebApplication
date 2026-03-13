package com.backend.app.model.dto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
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