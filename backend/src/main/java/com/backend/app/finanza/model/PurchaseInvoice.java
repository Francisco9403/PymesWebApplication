package com.backend.app.finanza.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.backend.app.proveedor.model.Supplier;
import com.backend.app.proveedor.model.dto.FiscalOrigin;
import com.backend.app.proveedor.model.dto.IvaCondition;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class PurchaseInvoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private LocalDate date;
    @Enumerated(EnumType.STRING)
    private ReceiptType receiptType;
    private int pointOfSale;
    private long receiptNumber;
    private String importDispatch;

    private String vendorDocumentNumber;
    @Enumerated(EnumType.STRING)
    private DocumentType vendorDocumentType;

    private BigDecimal totalAmount;

    // discriminación fiscal
    private BigDecimal exemptAmount;
    private BigDecimal nonTaxedAmount;

    // percepciones / impuestos
    private BigDecimal vatPerception;
    private BigDecimal iibbPerception;
    private BigDecimal municipalTaxes;
    private BigDecimal internalTaxes;
    private BigDecimal otherTaxes;
    private BigDecimal otherPerceptions;

    private String currency;
    private BigDecimal exchangeRate;

    private String operationCode;

    private String supplierNameSnapshot;
    private String supplierCuitSnapshot;
    private IvaCondition supplierIvaConditionSnapshot;
    private FiscalOrigin supplierOriginSnapshot;

    @ManyToOne
    private Supplier supplier;

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL)
    private List<PurchaseVat> vatBreakdown;

    public PurchaseInvoice() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public ReceiptType getReceiptType() {
        return receiptType;
    }

    public void setReceiptType(ReceiptType receiptType) {
        this.receiptType = receiptType;
    }

    public int getPointOfSale() {
        return pointOfSale;
    }

    public void setPointOfSale(int pointOfSale) {
        this.pointOfSale = pointOfSale;
    }

    public long getReceiptNumber() {
        return receiptNumber;
    }

    public void setReceiptNumber(long receiptNumber) {
        this.receiptNumber = receiptNumber;
    }

    public String getImportDispatch() {
        return importDispatch;
    }

    public void setImportDispatch(String importDispatch) {
        this.importDispatch = importDispatch;
    }

    public String getVendorDocumentNumber() {
        return vendorDocumentNumber;
    }

    public void setVendorDocumentNumber(String vendorDocumentNumber) {
        this.vendorDocumentNumber = vendorDocumentNumber;
    }

    public DocumentType getVendorDocumentType() {
        return vendorDocumentType;
    }

    public void setVendorDocumentType(DocumentType vendorDocumentType) {
        this.vendorDocumentType = vendorDocumentType;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BigDecimal getExemptAmount() {
        return exemptAmount;
    }

    public void setExemptAmount(BigDecimal exemptAmount) {
        this.exemptAmount = exemptAmount;
    }

    public BigDecimal getNonTaxedAmount() {
        return nonTaxedAmount;
    }

    public void setNonTaxedAmount(BigDecimal nonTaxedAmount) {
        this.nonTaxedAmount = nonTaxedAmount;
    }

    public BigDecimal getVatPerception() {
        return vatPerception;
    }

    public void setVatPerception(BigDecimal vatPerception) {
        this.vatPerception = vatPerception;
    }

    public BigDecimal getIibbPerception() {
        return iibbPerception;
    }

    public void setIibbPerception(BigDecimal iibbPerception) {
        this.iibbPerception = iibbPerception;
    }

    public BigDecimal getMunicipalTaxes() {
        return municipalTaxes;
    }

    public void setMunicipalTaxes(BigDecimal municipalTaxes) {
        this.municipalTaxes = municipalTaxes;
    }

    public BigDecimal getInternalTaxes() {
        return internalTaxes;
    }

    public void setInternalTaxes(BigDecimal internalTaxes) {
        this.internalTaxes = internalTaxes;
    }

    public BigDecimal getOtherTaxes() {
        return otherTaxes;
    }

    public void setOtherTaxes(BigDecimal otherTaxes) {
        this.otherTaxes = otherTaxes;
    }

    public BigDecimal getOtherPerceptions() {
        return otherPerceptions;
    }

    public void setOtherPerceptions(BigDecimal otherPerceptions) {
        this.otherPerceptions = otherPerceptions;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public BigDecimal getExchangeRate() {
        return exchangeRate;
    }

    public void setExchangeRate(BigDecimal exchangeRate) {
        this.exchangeRate = exchangeRate;
    }

    public String getOperationCode() {
        return operationCode;
    }

    public void setOperationCode(String operationCode) {
        this.operationCode = operationCode;
    }

    public String getSupplierNameSnapshot() {
        return supplierNameSnapshot;
    }

    public void setSupplierNameSnapshot(String supplierNameSnapshot) {
        this.supplierNameSnapshot = supplierNameSnapshot;
    }

    public String getSupplierCuitSnapshot() {
        return supplierCuitSnapshot;
    }

    public void setSupplierCuitSnapshot(String supplierCuitSnapshot) {
        this.supplierCuitSnapshot = supplierCuitSnapshot;
    }

    public IvaCondition getSupplierIvaConditionSnapshot() {
        return supplierIvaConditionSnapshot;
    }

    public void setSupplierIvaConditionSnapshot(IvaCondition supplierIvaConditionSnapshot) {
        this.supplierIvaConditionSnapshot = supplierIvaConditionSnapshot;
    }

    public FiscalOrigin getSupplierOriginSnapshot() {
        return supplierOriginSnapshot;
    }

    public void setSupplierOriginSnapshot(FiscalOrigin supplierOriginSnapshot) {
        this.supplierOriginSnapshot = supplierOriginSnapshot;
    }

    public Supplier getSupplier() {
        return supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    public List<PurchaseVat> getVatBreakdown() {
        return vatBreakdown;
    }

    public void setVatBreakdown(List<PurchaseVat> vatBreakdown) {
        this.vatBreakdown = vatBreakdown;
    }
}