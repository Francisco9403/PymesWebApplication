package com.backend.app.finanza.builder;

import com.backend.app.finanza.model.dto.PercepcionDTO;

public class PercepcionesBuilder {

    public static String build(PercepcionDTO p) {
        return String.join(";",
                p.fecha().toString(),
                String.valueOf(p.tipoComprobante()),
                String.valueOf(p.puntoVenta()),
                String.valueOf(p.numero()),
                p.cuit(),
                p.nombre(),
                p.tipoPercepcion(),
                p.importe().toPlainString()
        );
    }
}