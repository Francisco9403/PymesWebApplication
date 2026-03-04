package com.backend.app.model;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class PredictiveAlert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private AlertType type; // STOCK_CRITICAL, PRICE_REPOSITION, CONTEXT_WEATHER

    private String message;
    @Column(precision = 5, scale = 4)
    private BigDecimal probabilityScore;
    
    @Column(columnDefinition = "json")
    private String contextData; // Datos del clima o feriados
    
    private boolean resolved;

    public PredictiveAlert() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AlertType getType() {
        return type;
    }

    public void setType(AlertType type) {
        this.type = type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public BigDecimal getProbabilityScore() {
        return probabilityScore;
    }

    public void setProbabilityScore(BigDecimal probabilityScore) {
        this.probabilityScore = probabilityScore;
    }

    public String getContextData() {
        return contextData;
    }

    public void setContextData(String contextData) {
        this.contextData = contextData;
    }

    public boolean isResolved() {
        return resolved;
    }

    public void setResolved(boolean resolved) {
        this.resolved = resolved;
    }
}
