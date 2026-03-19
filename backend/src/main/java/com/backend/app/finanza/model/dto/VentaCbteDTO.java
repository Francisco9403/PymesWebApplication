package com.backend.app.finanza.model.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record VentaCbteDTO(
    LocalDate fechaComprobante,
    int tipoComprobante,
    int puntoVenta,
    long numeroComprobante,
    long numeroComprobanteHasta,
    int codigoDocumento,
    String numeroDocumento,
    String nombre,
    BigDecimal importeTotal,
    BigDecimal noGravado,
    BigDecimal percepNoCateg,
    BigDecimal exento,
    BigDecimal percepNac,
    BigDecimal iibb,
    BigDecimal municipales,
    BigDecimal internos,
    String moneda,
    BigDecimal tipoCambio,
    int cantidadAlicuotas,
    String codigoOperacion,
    BigDecimal otrosTributos,
    LocalDate fechaVencimiento,
    List<VentaAlicuotaDTO> alicuotas
) {}