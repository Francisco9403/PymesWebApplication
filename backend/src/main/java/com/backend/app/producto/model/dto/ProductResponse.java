package com.backend.app.producto.model.dto;
import java.math.BigDecimal;

public record ProductResponse(
    Long id,
    String sku,
    String name,
    String ean13,
    BigDecimal baseCostPrice,
    BigDecimal currentSalePrice
) {}