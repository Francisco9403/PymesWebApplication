package com.backend.app.cliente.model.dto;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record CreateCustomerRequest(
        @NotBlank(message = "El nombre del cliente es obligatorio")
        String name,

        @NotBlank(message = "El teléfono es necesario para contacto")
        String phone,

        @Email(message = "El formato del email no es válido")
        String email,

        String address,

        @PositiveOrZero(message = "El límite de crédito no puede ser negativo")
        BigDecimal creditLimit
) {}