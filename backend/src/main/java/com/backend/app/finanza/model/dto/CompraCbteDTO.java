package com.backend.app.finanza.model.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record CompraCbteDTO(
    LocalDate fecha,
    int tipoComprobante,
    int puntoVenta,
    long numeroComprobante,
    String despachoImportacion,
    int codigoDocumentoVendedor,
    String numeroDocumentoVendedor,
    String nombreVendedor,

    BigDecimal importeTotal,
    BigDecimal noGravado,
    BigDecimal exento,
    BigDecimal ivaPercepcion,
    BigDecimal otrasPercepciones,
    BigDecimal iibb,
    BigDecimal municipales,
    BigDecimal internos,

    String moneda,
    BigDecimal tipoCambio,
    int cantidadAlicuotas,
    String codigoOperacion,
    BigDecimal creditoFiscal,
    BigDecimal otrosTributos,

    String cuitCorredor,
    String denominacionCorredor,
    BigDecimal ivaComision,

    List<CompraAlicuotaDTO> alicuotas
) {}