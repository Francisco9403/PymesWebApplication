package com.backend.app.finanza.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.backend.app.finanza.model.DocumentType;
import com.backend.app.finanza.model.PurchaseInvoice;
import com.backend.app.finanza.model.ReceiptType;
import com.backend.app.finanza.model.dto.CompraAlicuotaDTO;
import com.backend.app.finanza.model.dto.CompraCbteDTO;
import com.backend.app.finanza.model.dto.PercepcionDTO;
import com.backend.app.proveedor.model.dto.IvaCondition;

@Service
public class CompraMapper {

    public List<PercepcionDTO> toPercepciones(PurchaseInvoice i) {
        List<PercepcionDTO> list = new ArrayList<>();

        addPercepcionIfPositive(list, i, "IIBB", safe(i.getIibbPerception()));
        addPercepcionIfPositive(list, i, "IVA", safe(i.getVatPerception()));
        addPercepcionIfPositive(list, i, "MUNICIPAL", safe(i.getMunicipalTaxes()));
        addPercepcionIfPositive(list, i, "INTERNOS", safe(i.getInternalTaxes()));
        addPercepcionIfPositive(list, i, "OTRAS", safe(i.getOtherPerceptions()));

        return list;
    }

    private void addPercepcionIfPositive(List<PercepcionDTO> list, PurchaseInvoice i, String tipo, BigDecimal importe) {
        if (importe.compareTo(BigDecimal.ZERO) > 0) {
            list.add(buildPercepcion(i, tipo, importe));
        }
    }

    private PercepcionDTO buildPercepcion(PurchaseInvoice i, String tipo, BigDecimal importe) {
        return new PercepcionDTO(
                i.getDate(),
                mapReceiptType(i.getReceiptType()),
                i.getPointOfSale(),
                i.getReceiptNumber(),
                resolveSupplierCuit(i),
                resolveSupplierName(i),
                tipo,
                safe(importe)
        );
    }

    public CompraCbteDTO toDTO(PurchaseInvoice i) {

        List<CompraAlicuotaDTO> alicuotas = Optional.ofNullable(i.getVatBreakdown())
                .orElse(List.of())
                .stream()
                .map(v -> new CompraAlicuotaDTO(
                        safe(v.getTaxableNet()),
                        v.getRate(),
                        safe(v.getVatAmount())
                ))
                .toList();

        if (i.getSupplierIvaConditionSnapshot() == IvaCondition.MONOTRIBUTO && !alicuotas.isEmpty()) {
            throw new IllegalStateException("Monotributo no puede tener IVA discriminado");
        }

        BigDecimal creditoFiscal = alicuotas.stream()
                .map(CompraAlicuotaDTO::ivaLiquidado)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal otrosTributos = safe(i.getOtherTaxes())
                .add(safe(i.getInternalTaxes()))
                .add(safe(i.getMunicipalTaxes()));

        System.out.println("TEST: " + i.getVendorDocumentType());

        return new CompraCbteDTO(
                i.getDate(),
                mapReceiptType(i.getReceiptType()),
                i.getPointOfSale(),
                i.getReceiptNumber(),
                i.getImportDispatch(),

                mapDocumentType(i.getVendorDocumentType()),
                resolveSupplierCuit(i),
                resolveSupplierName(i),

                safe(i.getTotalAmount()),
                safe(i.getNonTaxedAmount()),
                safe(i.getExemptAmount()),
                safe(i.getVatPerception()),
                safe(i.getOtherPerceptions()),
                safe(i.getIibbPerception()),
                safe(i.getMunicipalTaxes()),
                safe(i.getInternalTaxes()),

                defaultCurrency(i.getCurrency()),
                defaultExchangeRate(i.getExchangeRate()),

                alicuotas.size(),
                defaultOperacion(i),

                creditoFiscal,
                otrosTributos,

                null, // cuitCorredor
                null, // denominacionCorredor
                BigDecimal.ZERO, // ivaComision

                alicuotas
        );
    }

    private String resolveSupplierName(PurchaseInvoice i) {
        if (i.getSupplierNameSnapshot() != null) return i.getSupplierNameSnapshot();
        if (i.getSupplier() != null) return i.getSupplier().getBusinessName();
        return "SIN NOMBRE";
    }

    private String resolveSupplierCuit(PurchaseInvoice i) {
        if (i.getSupplierCuitSnapshot() != null) return i.getSupplierCuitSnapshot();
        if (i.getSupplier() != null) return i.getSupplier().getCuit();
        return "";
    }

    private String defaultCurrency(String currency) {
        return currency == null ? "PES" : currency;
    }

    private BigDecimal defaultExchangeRate(BigDecimal rate) {
        return rate == null ? BigDecimal.ONE : rate;
    }

    private String defaultOperacion(PurchaseInvoice i) {
        return i.getOperationCode() == null ? "" : i.getOperationCode();
    }

    private BigDecimal safe(BigDecimal v) {
        return v == null ? BigDecimal.ZERO : v;
    }

    private int mapReceiptType(ReceiptType type) {
        return switch (type) {
            case FACTURA_A -> 1;
            case FACTURA_B -> 6;
            case FACTURA_C -> 11;
            case NOTA_CREDITO_A -> 3;
            case NOTA_CREDITO_B -> 8;
            default -> throw new IllegalArgumentException("Tipo comprobante no soportado");
        };
    }

    private int mapDocumentType(DocumentType type) {
        return switch (type) {
            case CUIT -> 80;
            case DNI -> 96;
            case PASSPORT -> 94;
            default -> 99;
        };
    }
}