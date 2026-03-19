package com.backend.app.autentificacion.config.dto;

import java.time.YearMonth;
import java.util.List;

import com.backend.app.finanza.model.dto.CompraCbteDTO;
import com.backend.app.finanza.model.dto.VentaCbteDTO;

public record IvaRequest(
    List<VentaCbteDTO> ventas,
    List<CompraCbteDTO> compras,
    YearMonth periodo
) {}