package com.backend.app.sucursal.model.dto;

public record BranchDTO(
        Long id,
        String name,
        String address,
        String phone,
        boolean isPointOfSale
) {}