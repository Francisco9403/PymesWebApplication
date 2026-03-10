package com.backend.app.model.dto;

public record CreateSaleItemRequest(Long productId, Integer quantity) {
}