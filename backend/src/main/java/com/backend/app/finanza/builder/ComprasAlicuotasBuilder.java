package com.backend.app.finanza.builder;

import com.backend.app.finanza.format.AfipFormatUtil;
import com.backend.app.finanza.model.dto.CompraAlicuotaDTO;
import com.backend.app.finanza.model.dto.CompraCbteDTO;

public class ComprasAlicuotasBuilder {

    public static String build(CompraCbteDTO c, CompraAlicuotaDTO a) {

        StringBuilder sb = new StringBuilder();

        sb.append(AfipFormatUtil.formatNumero(c.tipoComprobante(), 3)); // 1-3
        sb.append(AfipFormatUtil.formatNumero(c.puntoVenta(), 5)); // 4-8
        sb.append(AfipFormatUtil.formatNumero(c.numeroComprobante(), 20)); // 9-28

        sb.append(AfipFormatUtil.formatNumero(c.codigoDocumentoVendedor(), 2)); // 29-30
        sb.append(AfipFormatUtil.padLeftZeros(c.numeroDocumentoVendedor(), 20)); // 31-50

        sb.append(AfipFormatUtil.formatImporte(a.netoGravado(), 15)); // 51-65
        sb.append(AfipFormatUtil.formatNumero(a.alicuota(), 4)); // 66-69
        sb.append(AfipFormatUtil.formatImporte(a.ivaLiquidado(), 15)); // 70-84

        if (sb.length() != 84) {
            throw new RuntimeException("Longitud inválida COMPRAS_ALICUOTAS: " + sb.length());
        }

        return sb.toString();
    }
}