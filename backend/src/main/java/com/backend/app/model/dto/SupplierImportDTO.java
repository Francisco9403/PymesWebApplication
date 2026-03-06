package com.backend.app.model.dto;

import java.util.List;

import com.backend.app.model.TaxCategory;

public record SupplierImportDTO(
    String businessName,
    String cuit,
    TaxCategory taxCategory,
    List<ProductImportDTO> products,
    Long branchId // Para saber a qué sucursal sumar el stock
) {}