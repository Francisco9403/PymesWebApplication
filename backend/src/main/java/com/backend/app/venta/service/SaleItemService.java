package com.backend.app.venta.service;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory; // 🚀 Importaciones de SLF4J
import org.springframework.stereotype.Service;
import com.backend.app.venta.dto.SaleItem;
import com.backend.app.venta.repository.SaleItemRepository;
import com.backend.app.exception.ResourceNotFoundException;

@Service
public class SaleItemService {

    // 🚀 Definición del Logger para esta clase
    private static final Logger log = LoggerFactory.getLogger(SaleItemService.class);

    private final SaleItemRepository saleItemRepository;

    public SaleItemService(SaleItemRepository saleItemRepository) {
        this.saleItemRepository = saleItemRepository;
    }

    public SaleItem getSaleItemById(Long id) {
        log.debug("Solicitando detalle del ítem de venta con ID: {}", id);

        return saleItemRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Consulta fallida: No se encontró el ítem de venta con ID: {}", id);
                    return new ResourceNotFoundException("Item de venta no encontrado con ID: " + id);
                });
    }

    public List<SaleItem> getHistoryByProduct(Long productId) {
        log.info("Consultando historial de movimientos para el producto ID: {}", productId);

        List<SaleItem> history = saleItemRepository.findByProductId(productId);

        log.info("Se recuperaron {} registros de venta para el producto ID: {}", history.size(), productId);
        return history;
    }
}