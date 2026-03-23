package com.backend.app.proveedor.model.dto;

import java.util.List;

import com.backend.app.producto.model.dto.ProductImportDTO;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record SupplierImportDTO(
        @NotBlank(message = "La razón social es obligatoria")
        String businessName,

        /* @NotBlank(message = "El CUIT es obligatorio")
        @Pattern(regexp = "^[0-9]{11}$", message = "El CUIT debe tener 11 dígitos") */
        String cuit,

        @NotNull(message = "La condición IVA es obligatoria")
        IvaCondition ivaCondition,
        
        /* @NotNull(message = "El origen fiscal es obligatorio") */
        FiscalOrigin fiscalOrigin,

        @NotEmpty(message = "La lista de productos no puede estar vacía")
        List<@Valid ProductImportDTO> products, // 🚀 @Valid es vital para validar cada item

        @NotNull(message = "La sucursal de destino es obligatoria")
        Long branchId
) {}