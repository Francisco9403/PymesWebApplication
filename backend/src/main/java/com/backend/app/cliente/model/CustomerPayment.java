package com.backend.app.cliente.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.backend.app.proveedor.model.dto.FiscalOrigin;
import com.backend.app.proveedor.model.dto.IvaCondition;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class CustomerPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Customer customer;

    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private IvaCondition ivaCondition;
    
    @Enumerated(EnumType.STRING)
    private FiscalOrigin fiscalOrigin;

    private LocalDateTime createdAt;

    private String notes;

    public CustomerPayment() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public IvaCondition getIvaCondition() {
        return ivaCondition;
    }

    public void setIvaCondition(IvaCondition ivaCondition) {
        this.ivaCondition = ivaCondition;
    }

    public FiscalOrigin getFiscalOrigin() {
        return fiscalOrigin;
    }

    public void setFiscalOrigin(FiscalOrigin fiscalOrigin) {
        this.fiscalOrigin = fiscalOrigin;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}