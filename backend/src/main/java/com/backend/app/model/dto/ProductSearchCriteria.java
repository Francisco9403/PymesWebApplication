package com.backend.app.model.dto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
public record ProductSearchCriteria(String name, Boolean belowMinStock, Boolean showBelowMinStock) {
    
}
