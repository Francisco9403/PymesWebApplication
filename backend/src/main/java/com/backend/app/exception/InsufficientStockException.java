package com.backend.app.exception;

public class InsufficientStockException extends RuntimeException {
    public InsufficientStockException(String productName, Integer requested, Integer available) {
        super(String.format("Stock insuficiente para %s. Pedido: %d, Disponible: %d", productName, requested, available));
    }

    public InsufficientStockException(String message) {
        super(message);
    }
}