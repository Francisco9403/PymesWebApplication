package com.backend.app.controller;

import com.backend.app.model.Sale;
import com.backend.app.service.IvaExportService;
import com.backend.app.service.SaleService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/finance")
@CrossOrigin(origins = "*")
@Validated
public class FinanceController {

    @Autowired
    private SaleService saleService;

    @Autowired
    private IvaExportService ivaService;

    @GetMapping("/export/iva-ventas")
    public ResponseEntity<byte[]> downloadIvaVentas(
            @Min(1) @Max(12) @RequestParam int month,
            @Min(2000) @RequestParam int year) {

        // 1. Usamos el SaleService para buscar las ventas fiscalizadas
        List<Sale> sales = saleService.getSalesByMonth(month, year);

        if (sales.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        // 2. Generamos el contenido del .txt
        String content = ivaService.generateVentasTxt(sales);
        byte[] data = content.getBytes(StandardCharsets.UTF_8);

        String filename = String.format("IVA_VENTAS_%02d_%d.txt", month, year);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.TEXT_PLAIN)
                .body(data);
    }
    // FinanceController.java

    @GetMapping("/export/retenciones")
    public ResponseEntity<byte[]> downloadRetenciones(
            @Min(1) @Max(12) @RequestParam int month,
            @Min(2000) @RequestParam int year) {
        // 1. Buscamos las ventas con percepciones de ese mes
        List<Sale> sales = saleService.getSalesByMonth(month, year);

        // 2. Generamos un reporte simple (por ahora texto, luego podemos pasarlo a PDF)
        StringBuilder sb = new StringBuilder();
        sb.append("REPORTE DE PERCEPCIONES IIBB - ").append(month).append("/").append(year).append("\n");
        sb.append("------------------------------------------------------------------\n");
        sb.append(String.format("%-12s | %-15s | %-30s | %-10s\n", "Fecha", "CUIT", "Cliente", "Monto"));
        sb.append("------------------------------------------------------------------\n");

        BigDecimal total = BigDecimal.ZERO;
        for (Sale s : sales) {
            if (s.getFiscalReceipt() != null && s.getFiscalReceipt().getIibbPerception() != null) {
                BigDecimal amount = s.getFiscalReceipt().getIibbPerception();
                sb.append(String.format("%-12s | %-15s | %-30s | %-10s\n",
                        s.getCreatedAt().toLocalDate(),
                        s.getFiscalReceipt().getCustomerCuit(),
                        s.getFiscalReceipt().getCustomerName(),
                        amount));
                total = total.add(amount);
            }
        }

        sb.append("------------------------------------------------------------------\n");
        sb.append("TOTAL PERCIBIDO: $").append(total).append("\n");

        byte[] data = sb.toString().getBytes(StandardCharsets.UTF_8);
        String filename = String.format("PERCEPCIONES_%02d_%d.txt", month, year);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.TEXT_PLAIN) // Por ahora .txt para que no falle, después vemos el PDF
                .body(data);
    }


}


//comando sql para probar el descagarel libro fiscal
//-- A. Insertamos la Venta (Usando el ENUM correcto: POS_PHYSICAL)
//INSERT INTO sale (total_amount, status, created_at, channel)
//VALUES (25000.00, 'COMPLETED', NOW(), 'POS_PHYSICAL');
//
//-- B. Vinculamos el Comprobante Fiscal (Percepción de $850.00)
//INSERT INTO fiscal_receipt (
//sale_id, type, point_of_sale, receipt_number,
//customer_cuit, customer_name, net_amount, tax_amount, iibb_perception
//) VALUES ((SELECT MAX(id) FROM sale),
//'FACTURA_A',
//    1,
//    205,
//    '20-35888999-4',
//    'Distribuidora Junín S.R.L.',
//    20661.16,
//    4338.84,
//    850.00
//);
