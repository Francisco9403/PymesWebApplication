package com.backend.app.finanza.model.dto;

public record LibroIvaArchivos(
    String ventasCbte,
    String ventasAlicuotas,
    String comprasCbte,
    String comprasAlicuotas
) {}