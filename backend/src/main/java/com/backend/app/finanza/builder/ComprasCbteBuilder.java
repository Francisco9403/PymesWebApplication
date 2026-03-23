package com.backend.app.finanza.builder;

import com.backend.app.finanza.format.AfipFormatUtil;
import com.backend.app.finanza.model.dto.CompraCbteDTO;

public class ComprasCbteBuilder {

    public static String build(CompraCbteDTO c) {

        StringBuilder sb = new StringBuilder();

        sb.append(AfipFormatUtil.formatFecha(c.fecha())); // 1-8
        sb.append(AfipFormatUtil.formatNumero(c.tipoComprobante(), 3)); // 9-11
        sb.append(AfipFormatUtil.formatNumero(c.puntoVenta(), 5)); // 12-16
        sb.append(AfipFormatUtil.formatNumero(c.numeroComprobante(), 20)); // 17-36

        sb.append(AfipFormatUtil.padRightSpaces(
                c.despachoImportacion() == null ? "" : c.despachoImportacion(), 16)); // 37-52

        sb.append(AfipFormatUtil.formatNumero(c.codigoDocumentoVendedor(), 2)); // 53-54
        sb.append(AfipFormatUtil.padLeftZeros(c.numeroDocumentoVendedor(), 20)); // 55-74
        sb.append(AfipFormatUtil.padRightSpaces(c.nombreVendedor(), 30)); // 75-104

        sb.append(AfipFormatUtil.formatImporte(c.importeTotal(), 15)); // 105-119
        sb.append(AfipFormatUtil.formatImporte(c.noGravado(), 15)); // 120-134
        sb.append(AfipFormatUtil.formatImporte(c.exento(), 15)); // 135-149
        sb.append(AfipFormatUtil.formatImporte(c.ivaPercepcion(), 15)); // 150-164
        sb.append(AfipFormatUtil.formatImporte(c.otrasPercepciones(), 15)); // 165-179
        sb.append(AfipFormatUtil.formatImporte(c.iibb(), 15)); // 180-194
        sb.append(AfipFormatUtil.formatImporte(c.municipales(), 15)); // 195-209
        sb.append(AfipFormatUtil.formatImporte(c.internos(), 15)); // 210-224

        sb.append(AfipFormatUtil.padRightSpaces(c.moneda(), 3)); // 225-227
        sb.append(AfipFormatUtil.formatTipoCambio(c.tipoCambio())); // 228-237

        sb.append(AfipFormatUtil.formatNumero(c.cantidadAlicuotas(), 1)); // 238
        sb.append(AfipFormatUtil.padRightSpaces(c.codigoOperacion(), 1)); // 239

        sb.append(AfipFormatUtil.formatImporte(c.creditoFiscal(), 15)); // 240-254
        sb.append(AfipFormatUtil.formatImporte(c.otrosTributos(), 15)); // 255-269

        sb.append(AfipFormatUtil.padLeftZeros(
                c.cuitCorredor() == null ? "" : c.cuitCorredor(), 11)); // 270-280

        sb.append(AfipFormatUtil.padRightSpaces(
                c.denominacionCorredor() == null ? "" : c.denominacionCorredor(), 30)); // 281-310

        sb.append(AfipFormatUtil.formatImporte(c.ivaComision(), 15)); // 311-325

        if (sb.length() != 325) {
            throw new RuntimeException("Longitud inválida COMPRAS_CBTE: " + sb.length());
        }

        return sb.toString();
    }
}



/* String result = sb.toString();

if (result.length() != 325) {

    System.out.println("❌ ERROR LONGITUD COMPRAS_CBTE: " + result.length());

    int pos = 0;

    System.out.println("fecha: " + result.substring(pos, pos += 8));
    System.out.println("tipoComprobante: " + result.substring(pos, pos += 3));
    System.out.println("puntoVenta: " + result.substring(pos, pos += 5));
    System.out.println("numeroComprobante: " + result.substring(pos, pos += 20));
    System.out.println("despachoImportacion: " + result.substring(pos, pos += 16));
    System.out.println("codigoDocumento: " + result.substring(pos, pos += 2));
    System.out.println("numeroDocumento: " + result.substring(pos, pos += 20));
    System.out.println("nombreVendedor: [" + result.substring(pos, pos += 30) + "]");
    System.out.println("importeTotal: " + result.substring(pos, pos += 15));
    System.out.println("noGravado: " + result.substring(pos, pos += 15));
    System.out.println("exento: " + result.substring(pos, pos += 15));
    System.out.println("ivaPercepcion: " + result.substring(pos, pos += 15));
    System.out.println("otrasPercepciones: " + result.substring(pos, pos += 15));
    System.out.println("iibb: " + result.substring(pos, pos += 15));
    System.out.println("municipales: " + result.substring(pos, pos += 15));
    System.out.println("internos: " + result.substring(pos, pos += 15));
    System.out.println("moneda: [" + result.substring(pos, pos += 3) + "]");
    System.out.println("tipoCambio: " + result.substring(pos, pos += 10));
    System.out.println("cantidadAlicuotas: " + result.substring(pos, pos += 1));
    System.out.println("codigoOperacion: [" + result.substring(pos, pos += 1) + "]");
    System.out.println("creditoFiscal: " + result.substring(pos, pos += 15));
    System.out.println("otrosTributos: " + result.substring(pos, pos += 15));
    System.out.println("cuitCorredor: " + result.substring(pos, pos += 11));
    System.out.println("denominacionCorredor: [" + result.substring(pos, pos += 30) + "]");
    System.out.println("ivaComision: " + result.substring(pos, pos += 15));

    throw new RuntimeException("Longitud inválida COMPRAS_CBTE: " + result.length());
} */