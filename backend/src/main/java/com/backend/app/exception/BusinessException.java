package com.backend.app.exception;

public class BusinessException extends RuntimeException {

    public BusinessException(Long id) {
        super("Category not found with id: " + id);
    }
}