package com.backend.app.finanza.model;

import java.math.BigDecimal;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class FiscalReceiptTribute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private FiscalReceipt fiscalReceipt;

    private String type; // IIBB, MUNICIPAL, INTERNO, etc.

    private BigDecimal amount;

    public FiscalReceiptTribute() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public FiscalReceipt getFiscalReceipt() {
        return fiscalReceipt;
    }

    public void setFiscalReceipt(FiscalReceipt fiscalReceipt) {
        this.fiscalReceipt = fiscalReceipt;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}