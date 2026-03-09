package com.backend.app.model.dto;

public record ProductSearchCriteria(String name, Boolean belowMinStock, Boolean showBelowMinStock) {
    
}
