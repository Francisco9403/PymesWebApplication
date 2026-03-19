package com.backend.app.venta.model.dto;
import java.util.List;

import com.backend.app.archivosParaRevisar.CommunicationChannel;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record CreateSaleRequest(
        @NotNull(message = "Debe especificar una sucursal")
        Long branchId,

        Long customerId, // Opcional (venta al mostrador)

        @NotNull(message = "El canal de venta es obligatorio")
        CommunicationChannel channel,

        @NotEmpty(message = "Una venta debe tener al menos un producto")
        List<@Valid CreateSaleItemRequest> items
) {}