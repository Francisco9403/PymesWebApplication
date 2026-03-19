package com.backend.app.finanza.model;

import java.math.BigDecimal;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class FiscalReceiptTax {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private FiscalReceipt fiscalReceipt;

    private BigDecimal netAmount;
    private Integer alicuota;
    private BigDecimal taxAmount;

    public FiscalReceiptTax() {
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

    public BigDecimal getNetAmount() {
        return netAmount;
    }

    public void setNetAmount(BigDecimal netAmount) {
        this.netAmount = netAmount;
    }

    public Integer getAlicuota() {
        return alicuota;
    }

    public void setAlicuota(Integer alicuota) {
        this.alicuota = alicuota;
    }

    public BigDecimal getTaxAmount() {
        return taxAmount;
    }

    public void setTaxAmount(BigDecimal taxAmount) {
        this.taxAmount = taxAmount;
    }
}
