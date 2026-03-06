package com.backend.app.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Product extends SyncEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String sku; // not required
    private String ean13; // por ahora no se usa
    private String qrCode;
    private String name;
    
    @JsonIgnore
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<ProductStock> stocks;

    @JsonIgnore
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AIProductDescription> aiDescriptions = new ArrayList<>();

    @ManyToMany
    @JoinTable(
        name = "product_supplier",
        joinColumns = @JoinColumn(name = "product_id"),
        inverseJoinColumns = @JoinColumn(name = "supplier_id")
    )
    private List<Supplier> suppliers = new ArrayList<>();

    @ManyToOne
    @JoinColumn
    private User user;

    private BigDecimal baseCostPrice;
    private BigDecimal currentSalePrice;
    
    @UpdateTimestamp
    private LocalDateTime lastSync;

    public Product() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getEan13() {
        return ean13;
    }

    public void setEan13(String ean13) {
        this.ean13 = ean13;
    }

    public String getQrCode() {
        return qrCode;
    }

    public void setQrCode(String qrCode) {
        this.qrCode = qrCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<ProductStock> getStocks() {
        return stocks;
    }

    public void setStocks(List<ProductStock> stocks) {
        this.stocks = stocks;
    }

    public List<AIProductDescription> getAiDescriptions() {
        return aiDescriptions;
    }

    public void setAiDescriptions(List<AIProductDescription> aiDescriptions) {
        this.aiDescriptions = aiDescriptions;
    }

    public List<Supplier> getSuppliers() {
        return suppliers;
    }

    public void setSuppliers(List<Supplier> suppliers) {
        this.suppliers = suppliers;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public BigDecimal getBaseCostPrice() {
        return baseCostPrice;
    }

    public void setBaseCostPrice(BigDecimal baseCostPrice) {
        this.baseCostPrice = baseCostPrice;
    }

    public BigDecimal getCurrentSalePrice() {
        return currentSalePrice;
    }

    public void setCurrentSalePrice(BigDecimal currentSalePrice) {
        this.currentSalePrice = currentSalePrice;
    }

    public LocalDateTime getLastSync() {
        return lastSync;
    }

    public void setLastSync(LocalDateTime lastSync) {
        this.lastSync = lastSync;
    }
}