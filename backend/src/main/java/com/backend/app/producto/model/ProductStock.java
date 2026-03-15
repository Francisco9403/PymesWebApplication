package com.backend.app.producto.model;

import com.backend.app.sucursal.model.Branch;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class ProductStock {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Product product;

    @ManyToOne
    private Branch branch; // Soporte Multi-sucursal

    private Integer quantity;
    private Integer criticalThreshold; // Stock mínimo estático
    private Double salesVelocity; // Calculado para Alertas Predictivas

    public ProductStock() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Branch getBranch() {
        return branch;
    }

    public void setBranch(Branch branch) {
        this.branch = branch;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Integer getCriticalThreshold() {
        return criticalThreshold;
    }

    public void setCriticalThreshold(Integer criticalThreshold) {
        this.criticalThreshold = criticalThreshold;
    }

    public Double getSalesVelocity() {
        return salesVelocity;
    }

    public void setSalesVelocity(Double salesVelocity) {
        this.salesVelocity = salesVelocity;
    }
}