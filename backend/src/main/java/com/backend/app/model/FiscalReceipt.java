package com.backend.app.model;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;

@Entity
public class FiscalReceipt { // Factura A, B, C
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cae; // Código de Autorización Electrónico
    private LocalDate caeExpiration;
    
    private Integer pointOfSale;
    private Long receiptNumber;
    
    @Enumerated(EnumType.STRING)
    private ReceiptType type; // FACTURA_A, FACTURA_B, TICKET_C
    
    @OneToOne
    private Sale sale;

    // Campos para Libro IVA Digital
    private BigDecimal netAmount;
    private BigDecimal taxAmount; // IVA 21%, 10.5%, etc.
    private BigDecimal iibbPerception;

    private String customerCuit;
    private String customerName;
    private Integer concept; // 1=Productos, 2=Servicios, 3=Productos y Servicios

    public FiscalReceipt() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCae() {
        return cae;
    }

    public void setCae(String cae) {
        this.cae = cae;
    }

    public LocalDate getCaeExpiration() {
        return caeExpiration;
    }

    public void setCaeExpiration(LocalDate caeExpiration) {
        this.caeExpiration = caeExpiration;
    }

    public Integer getPointOfSale() {
        return pointOfSale;
    }

    public void setPointOfSale(Integer pointOfSale) {
        this.pointOfSale = pointOfSale;
    }

    public Long getReceiptNumber() {
        return receiptNumber;
    }

    public void setReceiptNumber(Long receiptNumber) {
        this.receiptNumber = receiptNumber;
    }

    public ReceiptType getType() {
        return type;
    }

    public void setType(ReceiptType type) {
        this.type = type;
    }

    public Sale getSale() {
        return sale;
    }

    public void setSale(Sale sale) {
        this.sale = sale;
    }

    public BigDecimal getNetAmount() {
        return netAmount;
    }

    public void setNetAmount(BigDecimal netAmount) {
        this.netAmount = netAmount;
    }

    public BigDecimal getTaxAmount() {
        return taxAmount;
    }

    public void setTaxAmount(BigDecimal taxAmount) {
        this.taxAmount = taxAmount;
    }

    public BigDecimal getIibbPerception() {
        return iibbPerception;
    }

    public void setIibbPerception(BigDecimal iibbPerception) {
        this.iibbPerception = iibbPerception;
    }

    public String getCustomerCuit() {
        return customerCuit;
    }

    public void setCustomerCuit(String customerCuit) {
        this.customerCuit = customerCuit;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public Integer getConcept() {
        return concept;
    }

    public void setConcept(Integer concept) {
        this.concept = concept;
    }
}