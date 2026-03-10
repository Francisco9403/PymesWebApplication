package com.backend.app.model.dto;

import java.math.BigDecimal;

public record ProductUpdateRequest(String sku, String ean13, String name, BigDecimal baseCostPrice, BigDecimal currentSalePrice) {}