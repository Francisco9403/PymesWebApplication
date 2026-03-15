package com.backend.app.producto.model.dto;

public record ProductSearchCriteria(String name, Boolean belowMinStock, Boolean showBelowMinStock) {
    
}
