package com.backend.app.finanza.service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.backend.app.finanza.builder.ComprasAlicuotasBuilder;
import com.backend.app.finanza.builder.ComprasCbteBuilder;
import com.backend.app.finanza.builder.PercepcionesBuilder;
import com.backend.app.finanza.builder.VentasAlicuotasBuilder;
import com.backend.app.finanza.builder.VentasCbteBuilder;
import com.backend.app.finanza.model.FiscalReceipt;
import com.backend.app.finanza.model.PurchaseInvoice;
import com.backend.app.finanza.model.dto.CompraCbteDTO;
import com.backend.app.finanza.model.dto.LibroIvaArchivos;
import com.backend.app.finanza.model.dto.PercepcionDTO;
import com.backend.app.finanza.model.dto.VentaCbteDTO;
import com.backend.app.finanza.repository.FiscalReceiptRepository;
import com.backend.app.finanza.repository.PurchaseInvoiceRepository;
import com.backend.app.venta.model.SaleStatus;

@Service
public class LibroIvaService {

    private final FiscalReceiptRepository fiscalReceiptRepository;
    private final PurchaseInvoiceRepository purchaseInvoiceRepository;
    private final VentaMapper ventaMapper;
    private final CompraMapper compraMapper;

    public LibroIvaService(
            FiscalReceiptRepository fiscalReceiptRepository,
            PurchaseInvoiceRepository purchaseInvoiceRepository,
            VentaMapper ventaMapper,
            CompraMapper compraMapper
    ) {
        this.fiscalReceiptRepository = fiscalReceiptRepository;
        this.purchaseInvoiceRepository = purchaseInvoiceRepository;
        this.ventaMapper = ventaMapper;
        this.compraMapper = compraMapper;
    }

    public LibroIvaArchivos generarArchivos() {
        YearMonth currentMonth = YearMonth.now();

        LocalDate desde = currentMonth.atDay(1);
        LocalDate hasta = currentMonth.atEndOfMonth();

        // =====================
        // VENTAS
        // =====================
        List<FiscalReceipt> receipts = fiscalReceiptRepository.findByIssueDateBetween(desde, hasta);

        List<VentaCbteDTO> ventas = receipts.stream()
                .filter(r -> r.getSale().getStatus() == SaleStatus.COMPLETED)
                .map(ventaMapper::toDTO)
                .toList();

        String ventasCbte = ventas.stream()
                .map(VentasCbteBuilder::build)
                .collect(Collectors.joining("\n"));

        String ventasAlicuotas = ventas.stream()
                .flatMap(v -> v.alicuotas().stream()
                        .map(a -> VentasAlicuotasBuilder.build(v, a)))
                .collect(Collectors.joining("\n"));

        // =====================
        // COMPRAS
        // =====================
        List<PurchaseInvoice> comprasDb = purchaseInvoiceRepository.findByDateBetween(desde, hasta);

        List<CompraCbteDTO> compras = comprasDb.stream().map(compraMapper::toDTO).toList();

        String comprasCbte = compras.stream()
                .map(ComprasCbteBuilder::build)
                .collect(Collectors.joining("\n"));

        String comprasAlicuotas = compras.stream()
                .flatMap(c -> c.alicuotas().stream()
                        .map(a -> ComprasAlicuotasBuilder.build(c, a)))
                .collect(Collectors.joining("\n"));

        return new LibroIvaArchivos(
                ventasCbte,
                ventasAlicuotas,
                comprasCbte,
                comprasAlicuotas
        );
    }

    public String generarPercepciones(YearMonth periodo) {

        LocalDate desde = periodo.atDay(1);
        LocalDate hasta = periodo.atEndOfMonth();
    
        List<FiscalReceipt> receipts =
                fiscalReceiptRepository.findByIssueDateBetween(desde, hasta);
    
        List<PurchaseInvoice> compras =
                purchaseInvoiceRepository.findByDateBetween(desde, hasta);
    
        List<PercepcionDTO> percepciones = new ArrayList<>();
    
        // VENTAS
        receipts.stream()
                .filter(r -> r.getSale().getStatus() == SaleStatus.COMPLETED)
                .flatMap(r -> ventaMapper.toPercepciones(r).stream())
                .forEach(percepciones::add);
    
        // COMPRAS
        compras.stream()
                .flatMap(c -> compraMapper.toPercepciones(c).stream())
                .forEach(percepciones::add);
    
        return percepciones.stream()
                .map(PercepcionesBuilder::build)
                .collect(Collectors.joining("\n"));
    }
}