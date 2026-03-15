package com.backend.app.finanza.service;

import com.backend.app.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory; // 🚀 Importaciones de SLF4J
import org.springframework.stereotype.Service;

import com.backend.app.finanza.model.FiscalReceipt;
import com.backend.app.finanza.repository.FiscalReceiptRepository;

@Service
public class FiscalReceiptService {

    // 🚀 Definición del Logger para auditar la emisión de comprobantes
    private static final Logger log = LoggerFactory.getLogger(FiscalReceiptService.class);

    private final FiscalReceiptRepository fiscalReceiptRepository;

    public FiscalReceiptService(FiscalReceiptRepository fiscalReceiptRepository) {
        this.fiscalReceiptRepository = fiscalReceiptRepository;
    }

    public FiscalReceipt createReceipt(FiscalReceipt receipt) {
        log.info("Iniciando creación de comprobante fiscal para la venta ID: {}",
                receipt.getSale() != null ? receipt.getSale().getId() : "N/A");

        // Futuro: Acá es donde el sistema se va a comunicar con ARCA
        // para validar los datos y obtener el CAE y el vencimiento
        // antes de guardar en nuestra base de datos local.
        log.debug("Datos del comprobante: Tipo: {}, Punto de Venta: {}, Número: {}",
                receipt.getType(), receipt.getPointOfSale(), receipt.getReceiptNumber());

        FiscalReceipt savedReceipt = fiscalReceiptRepository.save(receipt);

        log.info("Comprobante fiscal guardado localmente con éxito. ID: {}", savedReceipt.getId());
        return savedReceipt;
    }

    public FiscalReceipt getReceiptBySale(Long saleId) {
        log.debug("Consultando comprobante fiscal asociado a la venta ID: {}", saleId);

        return fiscalReceiptRepository.findBySaleId(saleId)
                .orElseThrow(() -> {
                    log.warn("Consulta fallida: No se encontró comprobante fiscal para la venta ID: {}", saleId);
                    return new ResourceNotFoundException("Comprobante fiscal no encontrado para la venta: " + saleId);
                });
    }
}