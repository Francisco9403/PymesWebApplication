package com.backend.app.model.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CustomerListResponse(
        Long id,
        String name,
        String phone,
        BigDecimal currentDebt,
        BigDecimal creditLimit,
        String tag,
        LocalDateTime lastPurchase
) {}