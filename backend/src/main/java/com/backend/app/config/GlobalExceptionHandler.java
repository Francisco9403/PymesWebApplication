package com.backend.app.config;

import com.backend.app.exception.ApiError;
import com.backend.app.exception.BusinessException;
import com.backend.app.exception.InsufficientStockException;
import com.backend.app.exception.ResourceNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // 1. Recursos no encontrados (HTTP 404)
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleNotFound(ResourceNotFoundException ex, HttpServletRequest request) {
        log.error("Recurso no encontrado: {}", ex.getMessage());
        return createErrorResponse(ex.getMessage(), "RESOURCE_NOT_FOUND", HttpStatus.NOT_FOUND, request, null);
    }

    // 2. Reglas de negocio (HTTP 422 - Entidad no procesable)
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiError> handleBusiness(BusinessException ex, HttpServletRequest request) {
        log.warn("Violación de regla de negocio: {}", ex.getMessage());
        return createErrorResponse(ex.getMessage(), "BUSINESS_RULE_ERROR", HttpStatus.UNPROCESSABLE_ENTITY, request, null);
    }

    // 3. Stock insuficiente (HTTP 409 - Conflicto)
    @ExceptionHandler(InsufficientStockException.class)
    public ResponseEntity<ApiError> handleStock(InsufficientStockException ex, HttpServletRequest request) {
        log.warn("Falla de stock: {}", ex.getMessage());
        return createErrorResponse(ex.getMessage(), "INSUFFICIENT_STOCK", HttpStatus.CONFLICT, request, null);
    }

    // 4. Errores de validación de campos (@Valid)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
        List<String> details = ex.getBindingResult().getFieldErrors().stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .collect(Collectors.toList());

        return createErrorResponse("Error de validación en los datos", "VALIDATION_FAILED", HttpStatus.BAD_REQUEST, request, details);
    }

    // 5. El "Seguro de Vida" (HTTP 500)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGeneric(Exception ex, HttpServletRequest request) {
        log.error("ERROR NO CONTROLADO: ", ex);
        return createErrorResponse("Ocurrió un error interno inesperado", "INTERNAL_SERVER_ERROR", HttpStatus.INTERNAL_SERVER_ERROR, request, null);
    }

    // Método privado para estandarizar la creación del JSON de respuesta
    private ResponseEntity<ApiError> createErrorResponse(String message, String code, HttpStatus status, HttpServletRequest request, List<String> details) {
        ApiError error = new ApiError(
                message,
                code,
                status.value(),
                LocalDateTime.now(),
                request.getRequestURI(),
                details
        );
        return new ResponseEntity<>(error, status);
    }
}