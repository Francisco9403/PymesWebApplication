package com.backend.app.model;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class Branch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String address;
    private String phone;
    
    // Indica si es un depósito central o punto de venta
    private boolean isPointOfSale;

    @OneToMany(mappedBy = "branch")
    private List<ProductStock> inventory;

    public Branch() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public boolean isPointOfSale() {
        return isPointOfSale;
    }

    public void setPointOfSale(boolean isPointOfSale) {
        this.isPointOfSale = isPointOfSale;
    }

    public List<ProductStock> getInventory() {
        return inventory;
    }

    public void setInventory(List<ProductStock> inventory) {
        this.inventory = inventory;
    }
}