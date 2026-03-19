package com.backend.app.finanza.model.dto;

import java.math.BigDecimal;

public record VentaAlicuotaDTO(BigDecimal netoGravado, int alicuota, BigDecimal ivaLiquidado) {
}
