package com.backend.app.finanza.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.backend.app.finanza.model.FiscalReceipt;
import com.backend.app.finanza.model.ReceiptType;
import com.backend.app.finanza.model.dto.PercepcionDTO;
import com.backend.app.finanza.model.dto.VentaAlicuotaDTO;
import com.backend.app.finanza.model.dto.VentaCbteDTO;

@Service
public class VentaMapper {

    public List<PercepcionDTO> toPercepciones(FiscalReceipt fr) {

        List<PercepcionDTO> list = new ArrayList<>();
    
        BigDecimal iibb = nvl(fr.getIibbPerception());
    
        if (iibb.compareTo(BigDecimal.ZERO) > 0) {
            list.add(new PercepcionDTO(
                    fr.getIssueDate(),
                    fr.getType().getAfipCode(),
                    fr.getPointOfSale(),
                    fr.getReceiptNumberFrom(),
                    normalizeDoc(fr.getCustomerCuit()),
                    fr.getCustomerName(),
                    "IIBB",
                    applySign(iibb, fr.getType())
            ));
        }
    
        return list;
    }

    public VentaCbteDTO toDTO(FiscalReceipt fr) {

        ReceiptType type = fr.getType();

        List<VentaAlicuotaDTO> alicuotas = fr.getTaxes().stream()
                .map(t -> new VentaAlicuotaDTO(
                        applySign(t.getNetAmount(), type),
                        t.getAlicuota(),
                        applySign(t.getTaxAmount(), type)
                ))
                .toList();

        BigDecimal importeTotal = applySign(
                fr.getSale().getTotalAmount(), type
        );

        // =====================
        // PERCEPCIONES
        // =====================
        BigDecimal iibb = applySign(nvl(fr.getIibbPerception()), type);
    
        BigDecimal percepNac = BigDecimal.ZERO;     // no lo tenés modelado
        BigDecimal municipales = BigDecimal.ZERO;   // no lo tenés modelado
        BigDecimal internos = BigDecimal.ZERO;      // no lo tenés modelado

        // =====================
        // IMPORTES
        // =====================
        BigDecimal noGravado = BigDecimal.ZERO; // mejorar si tenés lógica
        BigDecimal exento = BigDecimal.ZERO;

        return new VentaCbteDTO(
                fr.getIssueDate(),
                type.getAfipCode(),
                fr.getPointOfSale(),
                fr.getReceiptNumberFrom(),
                fr.getReceiptNumberTo() != null
                        ? fr.getReceiptNumberTo()
                        : fr.getReceiptNumberFrom(),

                fr.getCustomerDocType(),
                normalizeDoc(fr.getCustomerCuit()),
                truncate(fr.getCustomerName(), 30),

                importeTotal,

                noGravado,
                BigDecimal.ZERO, // percepNoCateg
                exento,
                percepNac,
                iibb,
                municipales,
                internos,

                "PES",
                BigDecimal.ONE,

                alicuotas.size(),

                "", // codigoOperacion

                BigDecimal.ZERO,

                null, // fechaVencimiento

                alicuotas
        );
    }

    private BigDecimal applySign(BigDecimal value, ReceiptType type) {
        if (value == null) return BigDecimal.ZERO;
        return type.isCreditNote() ? value.negate() : value;
    }

    private BigDecimal nvl(BigDecimal v) {
        return v == null ? BigDecimal.ZERO : v;
    }

    private String normalizeDoc(String doc) {
        return doc == null ? "" : doc.replaceAll("[^0-9]", "");
    }

    private String truncate(String s, int max) {
        if (s == null) return "";
        return s.length() > max ? s.substring(0, max) : s;
    }
}