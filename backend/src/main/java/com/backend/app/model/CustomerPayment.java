package com.backend.app.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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
    private TaxCategory method;

    private LocalDateTime createdAt;

    private String notes;

    public CustomerPayment() {
    }

    public Long getId() {
        return id;
    }

    public Customer getCustomer() {
        return customer;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public TaxCategory getMethod() {
        return method;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getNotes() {
        return notes;
    }
}