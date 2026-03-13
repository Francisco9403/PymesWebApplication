package com.backend.app.model.dto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.backend.app.model.SaleStatus;

public record CustomerSaleResponse(
        Long id,
        BigDecimal totalAmount,
        Integer totalItems,
        SaleStatus status,
        LocalDateTime createdAt
) {}