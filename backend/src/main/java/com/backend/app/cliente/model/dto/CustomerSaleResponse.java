package com.backend.app.cliente.model.dto;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.backend.app.venta.dto.SaleStatus;

public record CustomerSaleResponse(
        Long id,
        BigDecimal totalAmount,
        Integer totalItems,
        SaleStatus status,
        LocalDateTime createdAt
) {}