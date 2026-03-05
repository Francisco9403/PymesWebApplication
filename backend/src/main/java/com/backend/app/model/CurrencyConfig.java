package com.backend.app.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class CurrencyConfig {
    @Id
    private String code; // USD_MEP, USD_OFICIAL, CRIPTO
    private BigDecimal rate;
    private Double markupPercentage; // Regla: "Si el dólar sube > 2%..."
    private LocalDateTime lastUpdate;

    public CurrencyConfig() {
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public BigDecimal getRate() {
        return rate;
    }

    public void setRate(BigDecimal rate) {
        this.rate = rate;
    }

    public Double getMarkupPercentage() {
        return markupPercentage;
    }

    public void setMarkupPercentage(Double markupPercentage) {
        this.markupPercentage = markupPercentage;
    }

    public LocalDateTime getLastUpdate() {
        return lastUpdate;
    }

    public void setLastUpdate(LocalDateTime lastUpdate) {
        this.lastUpdate = lastUpdate;
    }
}