package com.backend.app.model.dto;

import java.math.BigDecimal;

public record CreateCustomerRequest(
        String name,
        String phone,
        String email,
        String address,
        BigDecimal creditLimit
) {}