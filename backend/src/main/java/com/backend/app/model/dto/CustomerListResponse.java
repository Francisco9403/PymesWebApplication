package com.backend.app.model.dto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
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