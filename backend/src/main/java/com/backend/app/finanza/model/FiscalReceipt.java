package com.backend.app.finanza.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.backend.app.venta.model.Sale;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;

@Entity
public class FiscalReceipt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cae;
    private LocalDate caeExpiration;

    private Integer pointOfSale;

    private Long receiptNumberFrom;
    private Long receiptNumberTo;

    private LocalDate issueDate;

    @Enumerated(EnumType.STRING)
    private ReceiptType type;

    @OneToOne
    private Sale sale;

    @OneToMany(mappedBy = "fiscalReceipt", cascade = CascadeType.ALL)
    private List<FiscalReceiptTax> taxes;

    private BigDecimal iibbPerception;

    private String customerCuit;
    private String customerName;
    private Integer customerDocType;

    private Integer concept;

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

    public Long getReceiptNumberFrom() {
        return receiptNumberFrom;
    }

    public void setReceiptNumberFrom(Long receiptNumberFrom) {
        this.receiptNumberFrom = receiptNumberFrom;
    }

    public Long getReceiptNumberTo() {
        return receiptNumberTo;
    }

    public void setReceiptNumberTo(Long receiptNumberTo) {
        this.receiptNumberTo = receiptNumberTo;
    }

    public LocalDate getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(LocalDate issueDate) {
        this.issueDate = issueDate;
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

    public List<FiscalReceiptTax> getTaxes() {
        return taxes;
    }

    public void setTaxes(List<FiscalReceiptTax> taxes) {
        this.taxes = taxes;
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

    public Integer getCustomerDocType() {
        return customerDocType;
    }

    public void setCustomerDocType(Integer customerDocType) {
        this.customerDocType = customerDocType;
    }

    public Integer getConcept() {
        return concept;
    }

    public void setConcept(Integer concept) {
        this.concept = concept;
    }
}