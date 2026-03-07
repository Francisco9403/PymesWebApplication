package com.backend.app.model.dto;

public record BranchDTO(
        Long id,
        String name,
        String address,
        String phone,
        boolean isPointOfSale
) {}