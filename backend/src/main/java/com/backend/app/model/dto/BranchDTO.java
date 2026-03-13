package com.backend.app.model.dto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
public record BranchDTO(
        Long id,
        String name,
        String address,
        String phone,
        boolean isPointOfSale
) {}