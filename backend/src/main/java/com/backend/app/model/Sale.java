package com.backend.app.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;

@Entity
public class Sale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Branch branch;

    @Enumerated(EnumType.STRING)
    private CommunicationChannel channel; // De dónde vino la venta

    @OneToMany(cascade = CascadeType.ALL)
    private List<SaleItem> items;

    private BigDecimal totalAmount;
    
    @Enumerated(EnumType.STRING)
    private SaleStatus status;

    @OneToOne(mappedBy = "sale", cascade = CascadeType.ALL, orphanRemoval = true)
    private Payment payment;

    @OneToOne(mappedBy = "sale", cascade = CascadeType.ALL)
    private FiscalReceipt fiscalReceipt; // Conexión con ARCA

    private LocalDateTime createdAt;

    public Sale() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Branch getBranch() {
        return branch;
    }

    public void setBranch(Branch branch) {
        this.branch = branch;
    }

    public CommunicationChannel getChannel() {
        return channel;
    }

    public void setChannel(CommunicationChannel channel) {
        this.channel = channel;
    }

    public List<SaleItem> getItems() {
        return items;
    }

    public void setItems(List<SaleItem> items) {
        this.items = items;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public SaleStatus getStatus() {
        return status;
    }

    public void setStatus(SaleStatus status) {
        this.status = status;
    }

    public Payment getPayment() {
        return payment;
    }

    public void setPayment(Payment payment) {
        this.payment = payment;
    }

    public FiscalReceipt getFiscalReceipt() {
        return fiscalReceipt;
    }

    public void setFiscalReceipt(FiscalReceipt fiscalReceipt) {
        this.fiscalReceipt = fiscalReceipt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}