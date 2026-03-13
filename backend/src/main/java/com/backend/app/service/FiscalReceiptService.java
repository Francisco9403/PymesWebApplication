package com.backend.app.service;

import com.backend.app.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import com.backend.app.model.FiscalReceipt;
import com.backend.app.repository.FiscalReceiptRepository;
import com.backend.app.exception.BusinessException;

@Service
public class FiscalReceiptService {

    private final FiscalReceiptRepository fiscalReceiptRepository;

    public FiscalReceiptService(FiscalReceiptRepository fiscalReceiptRepository) {
        this.fiscalReceiptRepository = fiscalReceiptRepository;
    }

    public FiscalReceipt createReceipt(FiscalReceipt receipt) {
        // Futuro: Acá es donde el sistema se va a comunicar con ARCA
        // para validar los datos y obtener el CAE y el vencimiento
        // antes de guardar en nuestra base de datos local.
        return fiscalReceiptRepository.save(receipt);
    }

    public FiscalReceipt getReceiptBySale(Long saleId) {
        // 🚀 Cambio: ResourceNotFoundException
        return fiscalReceiptRepository.findBySaleId(saleId)
                .orElseThrow(() -> new ResourceNotFoundException("Comprobante fiscal no encontrado para la venta: " + saleId));
    }
}