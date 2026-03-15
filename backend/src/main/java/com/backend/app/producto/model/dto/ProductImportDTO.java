package com.backend.app.producto.model.dto;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record ProductImportDTO(
        @NotBlank(message = "El nombre del producto es obligatorio")
        String name,

        @NotNull(message = "El precio de costo es obligatorio")
        @Positive(message = "El precio de costo debe ser mayor a cero")
        BigDecimal baseCostPrice,

        @NotNull(message = "La cantidad es obligatoria")
        @Min(value = 1, message = "La cantidad mínima debe ser 1")
        Integer quantity,

        /* @Size(min = 8, max = 13, message = "El EAN debe tener entre 8 y 13 caracteres") */
        String ean13
) {}