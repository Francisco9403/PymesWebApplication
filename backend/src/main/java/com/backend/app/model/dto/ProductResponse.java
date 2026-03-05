package com.backend.app.model.dto;

import java.math.BigDecimal;

public record ProductResponse(
    Long id,
    String sku,
    BigDecimal currentSalePrice
) {}