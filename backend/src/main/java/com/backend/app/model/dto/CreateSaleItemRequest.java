package com.backend.app.model.dto;
import jakarta.validation.constraints.*;

public record CreateSaleItemRequest(
        @NotNull(message = "El ID de producto es obligatorio")
        Long productId,

        @NotNull(message = "La cantidad es obligatoria")
        @Min(value = 1, message = "La cantidad mínima de venta es 1")
        Integer quantity
) {}