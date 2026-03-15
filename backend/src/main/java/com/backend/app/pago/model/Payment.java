package com.backend.app.pago.model;

import java.math.BigDecimal;

import com.backend.app.venta.dto.Sale;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;

import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

@Entity
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String transactionId; // ID externo para Webhook
    private BigDecimal amount;
    
    @Enumerated(EnumType.STRING)
    private PaymentStatus status; // PENDING, CONFIRMED, REJECTED

    private String qrData; // Contenido del QR dinámico
    
    @Enumerated(EnumType.STRING)
    private Currency currency; // Multi-moneda (USD, ARS, BTC)
    
    private BigDecimal exchangeRateAtTime; // Tipo de cambio capturado

    @OneToOne
    @JoinColumn(name = "sale_id", nullable = false)
    private Sale sale;

    public Payment() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

    public String getQrData() {
        return qrData;
    }

    public void setQrData(String qrData) {
        this.qrData = qrData;
    }

    public Currency getCurrency() {
        return currency;
    }

    public void setCurrency(Currency currency) {
        this.currency = currency;
    }

    public BigDecimal getExchangeRateAtTime() {
        return exchangeRateAtTime;
    }

    public void setExchangeRateAtTime(BigDecimal exchangeRateAtTime) {
        this.exchangeRateAtTime = exchangeRateAtTime;
    }
}