package com.backend.app.finanza.model.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PercepcionDTO(
    LocalDate fecha,
    int tipoComprobante,
    int puntoVenta,
    long numero,
    String cuit,
    String nombre,
    String tipoPercepcion, // IIBB, IVA, etc
    BigDecimal importe
) {}