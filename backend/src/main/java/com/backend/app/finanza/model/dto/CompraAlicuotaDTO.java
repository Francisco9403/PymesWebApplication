package com.backend.app.finanza.model.dto;

import java.math.BigDecimal;

public record CompraAlicuotaDTO(
    BigDecimal netoGravado,
    int alicuota,
    BigDecimal ivaLiquidado
) {}