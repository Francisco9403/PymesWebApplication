package com.backend.app.producto.model.dto;

import java.math.BigDecimal;
import jakarta.validation.constraints.*;

public record ProductUpdateRequest(
        String sku,

        @Size(min = 8, max = 13, message = "EAN inválido")
        String ean13,

        @NotBlank(message = "El nombre no puede quedar vacío")
        String name,

        @NotNull(message = "El costo es obligatorio")
        @Positive(message = "El costo debe ser positivo")
        BigDecimal baseCostPrice,

        @NotNull(message = "El precio de venta es obligatorio")
        @Positive(message = "El precio de venta debe ser positivo")
        BigDecimal currentSalePrice
) {}