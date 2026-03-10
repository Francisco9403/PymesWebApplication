package com.backend.app.model.dto;

import java.util.List;

import com.backend.app.model.PaymentMethod;

public record SupplierImportDTO(
    String businessName,
    String cuit,
    PaymentMethod paymentMethod,
    List<ProductImportDTO> products,
    Long branchId // Para saber a qué sucursal sumar el stock
) {}