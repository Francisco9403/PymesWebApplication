package com.backend.app.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "finance_settings")
public class FinanceSettings {

    @Id
    private Long id = 1L;

    private boolean automaticMarkupEnabled;
    private BigDecimal thresholdPercentage; // El 2% que configuraste en el front
    private BigDecimal lastMepValue; // Para saber desde dónde comparar la subida

    public FinanceSettings() {}

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public boolean isAutomaticMarkupEnabled() { return automaticMarkupEnabled; }
    public void setAutomaticMarkupEnabled(boolean automaticMarkupEnabled) { this.automaticMarkupEnabled = automaticMarkupEnabled; }
    public BigDecimal getThresholdPercentage() { return thresholdPercentage; }
    public void setThresholdPercentage(BigDecimal thresholdPercentage) { this.thresholdPercentage = thresholdPercentage; }
    public BigDecimal getLastMepValue() { return lastMepValue; }
    public void setLastMepValue(BigDecimal lastMepValue) { this.lastMepValue = lastMepValue; }
}