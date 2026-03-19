package com.backend.app.finanza.builder;

import com.backend.app.finanza.format.AfipFormatUtil;
import com.backend.app.finanza.model.dto.VentaAlicuotaDTO;
import com.backend.app.finanza.model.dto.VentaCbteDTO;

public class VentasAlicuotasBuilder {

    public static String build(VentaCbteDTO cbte, VentaAlicuotaDTO a) {

        StringBuilder sb = new StringBuilder();

        sb.append(AfipFormatUtil.formatNumero(cbte.tipoComprobante(), 3)); // 1-3
        sb.append(AfipFormatUtil.formatNumero(cbte.puntoVenta(), 5)); // 4-8
        sb.append(AfipFormatUtil.formatNumero(cbte.numeroComprobante(), 20)); // 9-28

        sb.append(AfipFormatUtil.formatImporte(a.netoGravado(), 15)); // 29-43
        sb.append(AfipFormatUtil.formatNumero(a.alicuota(), 4)); // 44-47
        sb.append(AfipFormatUtil.formatImporte(a.ivaLiquidado(), 15)); // 48-62

        if (sb.length() != 62) {
            throw new RuntimeException("Longitud inválida ALICUOTAS: " + sb.length());
        }

        return sb.toString();
    }
}