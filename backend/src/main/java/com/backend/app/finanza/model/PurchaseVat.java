package com.backend.app.finanza.model;

import java.math.BigDecimal;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class PurchaseVat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private BigDecimal taxableNet;
    private int rate; // 21, 10.5, etc.
    private BigDecimal vatAmount;

    @ManyToOne
    private PurchaseInvoice invoice;

    public PurchaseVat() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getTaxableNet() {
        return taxableNet;
    }

    public void setTaxableNet(BigDecimal taxableNet) {
        this.taxableNet = taxableNet;
    }

    public int getRate() {
        return rate;
    }

    public void setRate(int rate) {
        this.rate = rate;
    }

    public BigDecimal getVatAmount() {
        return vatAmount;
    }

    public void setVatAmount(BigDecimal vatAmount) {
        this.vatAmount = vatAmount;
    }

    public PurchaseInvoice getInvoice() {
        return invoice;
    }

    public void setInvoice(PurchaseInvoice invoice) {
        this.invoice = invoice;
    }
}