package com.backend.app.autentificacion.config.dto;
import jakarta.validation.constraints.*;

public record LoginRequest(
        @NotBlank(message = "El email no puede estar vacío")
        @Email(message = "Debe ser un email válido")
        String email,

        @NotBlank(message = "La contraseña es obligatoria")
        String password
) {}