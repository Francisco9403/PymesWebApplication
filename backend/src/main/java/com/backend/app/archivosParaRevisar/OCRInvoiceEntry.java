package com.backend.app.archivosParaRevisar;

import java.time.LocalDateTime;

import com.backend.app.proveedor.model.Supplier;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class OCRInvoiceEntry { // Carga de facturas de proveedores
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String rawTextOcr;
    private String fileUrl; // Link al PDF/Foto
    
    @ManyToOne
    private Supplier supplier;
    
    private LocalDateTime processingDate;

    public OCRInvoiceEntry() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRawTextOcr() {
        return rawTextOcr;
    }

    public void setRawTextOcr(String rawTextOcr) {
        this.rawTextOcr = rawTextOcr;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public Supplier getSupplier() {
        return supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    public LocalDateTime getProcessingDate() {
        return processingDate;
    }

    public void setProcessingDate(LocalDateTime processingDate) {
        this.processingDate = processingDate;
    }
}