package com.backend.app.finanza.builder;

import com.backend.app.finanza.format.AfipFormatUtil;
import com.backend.app.finanza.model.dto.VentaCbteDTO;

public class VentasCbteBuilder {

    public static String build(VentaCbteDTO v) {
        StringBuilder sb = new StringBuilder();

        sb.append(AfipFormatUtil.formatFecha(v.fechaComprobante())); // 1-8
        sb.append(AfipFormatUtil.formatNumero(v.tipoComprobante(), 3)); // 9-11
        sb.append(AfipFormatUtil.formatNumero(v.puntoVenta(), 5)); // 12-16
        sb.append(AfipFormatUtil.formatNumero(v.numeroComprobante(), 20)); // 17-36
        sb.append(AfipFormatUtil.formatNumero(v.numeroComprobanteHasta(), 20)); // 37-56
        sb.append(AfipFormatUtil.formatNumero(v.codigoDocumento(), 2)); // 57-58
        sb.append(AfipFormatUtil.padLeftZeros(v.numeroDocumento(), 20)); // 59-78
        sb.append(AfipFormatUtil.padRightSpaces(v.nombre(), 30)); // 79-108

        sb.append(AfipFormatUtil.formatImporte(v.importeTotal(), 15)); // 109-123
        sb.append(AfipFormatUtil.formatImporte(v.noGravado(), 15)); // 124-138
        sb.append(AfipFormatUtil.formatImporte(v.percepNoCateg(), 15)); // 139-153
        sb.append(AfipFormatUtil.formatImporte(v.exento(), 15)); // 154-168
        sb.append(AfipFormatUtil.formatImporte(v.percepNac(), 15)); // 169-183
        sb.append(AfipFormatUtil.formatImporte(v.iibb(), 15)); // 184-198
        sb.append(AfipFormatUtil.formatImporte(v.municipales(), 15)); // 199-213
        sb.append(AfipFormatUtil.formatImporte(v.internos(), 15)); // 214-228

        sb.append(AfipFormatUtil.padRightSpaces(v.moneda(), 3)); // 229-231
        sb.append(AfipFormatUtil.formatTipoCambio(v.tipoCambio())); // 232-241

        sb.append(AfipFormatUtil.formatNumero(v.cantidadAlicuotas(), 1)); // 242
        sb.append(AfipFormatUtil.padRightSpaces(v.codigoOperacion(), 1)); // 243

        sb.append(AfipFormatUtil.formatImporte(v.otrosTributos(), 15)); // 244-258
        sb.append(AfipFormatUtil.formatFecha(v.fechaVencimiento())); // 259-266

        if (sb.length() != 266) {
            throw new RuntimeException("Longitud inválida: " + sb.length());
        }

        return sb.toString();
    }
}