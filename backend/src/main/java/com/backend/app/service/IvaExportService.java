package com.backend.app.service;

import com.backend.app.exception.BusinessException;
import com.backend.app.model.Sale;
import com.backend.app.model.FiscalReceipt;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class IvaExportService {

    private final DateTimeFormatter afipDate = DateTimeFormatter.ofPattern("yyyyMMdd");

    public String generateVentasTxt(List<Sale> sales) {
        if (sales == null || sales.isEmpty()) {
            throw new BusinessException("No hay ventas para exportar en el período seleccionado.");
        }
        StringBuilder sb = new StringBuilder();

        for (Sale sale : sales) {
            FiscalReceipt fr = sale.getFiscalReceipt();
            if (fr == null) continue;

            // Formato AFIP: Fecha(8) + Tipo(3) + PV(5) + Nro(20) + CUIT(20) + Nombre(65) + Total(15)
            sb.append(sale.getCreatedAt().format(afipDate))
                    .append(padLeft(getAfipTypeCode(fr.getType()), 3, '0'))
                    .append(padLeft(fr.getPointOfSale().toString(), 5, '0'))
                    .append(padLeft(fr.getReceiptNumber().toString(), 20, '0'))
                    .append(padLeft(fr.getCustomerCuit().replaceAll("[^0-9]", ""), 20, '0'))
                    .append(padRight(fr.getCustomerName(), 65, ' '))
                    .append(formatAfipAmount(sale.getTotalAmount()))
                    .append("\r\n"); // CRLF para Windows/AFIP
        }
        return sb.toString();
    }

    private String getAfipTypeCode(com.backend.app.model.ReceiptType type) {
        if (type == null) return "000";
        return switch (type) {
            case FACTURA_A -> "001";
            case FACTURA_B -> "006";
            case FACTURA_C -> "011";
            default -> "000";
        };
    }

    private String padLeft(String s, int n, char c) {
        if (s == null) s = "";
        return s.length() >= n ? s.substring(0, n) : String.format("%" + n + "s", s).replace(' ', c);
    }

    private String padRight(String s, int n, char c) {
        if (s == null) s = "";
        return s.length() >= n ? s.substring(0, n) : String.format("%-" + n + "s", s).replace(' ', c);
    }

    private String formatAfipAmount(BigDecimal amount) {
        if (amount == null) amount = BigDecimal.ZERO;
        String clean = amount.multiply(new BigDecimal("100")).toBigInteger().toString();
        return padLeft(clean, 15, '0');
    }
}