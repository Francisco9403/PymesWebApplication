package com.backend.app.model.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

public record CustomerListResponse(
        Long id,
        String name,
        String phone,
        BigDecimal currentDebt,
        BigDecimal creditLimit,
        Set<String> tags,
        LocalDateTime lastPurchase
) {}