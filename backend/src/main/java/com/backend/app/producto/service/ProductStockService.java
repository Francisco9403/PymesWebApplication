package com.backend.app.producto.service;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory; // 🚀 Importaciones de SLF4J
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.app.producto.model.ProductStock;
import com.backend.app.producto.repository.ProductStockRepository;
import com.backend.app.exception.BusinessException;
import com.backend.app.exception.ResourceNotFoundException;

@Service
@Transactional
public class ProductStockService {

    // 🚀 Definición del Logger
    private static final Logger log = LoggerFactory.getLogger(ProductStockService.class);

    private final ProductStockRepository productStockRepository;

    public ProductStockService(ProductStockRepository productStockRepository) {
        this.productStockRepository = productStockRepository;
    }

    public ProductStock updateStockQuantity(ProductStock incomingData) {
        log.info("Iniciando actualización de stock para producto ID: {} en sucursal ID: {}",
                incomingData.getProduct() != null ? incomingData.getProduct().getId() : "N/A",
                incomingData.getBranch() != null ? incomingData.getBranch().getId() : "N/A");

        if (incomingData.getProduct() == null || incomingData.getBranch() == null) {
            log.warn("Intento de actualización de stock fallido: Datos de producto o sucursal nulos.");
            throw new BusinessException("No se puede actualizar el stock: faltan datos del producto o sucursal");
        }

        Optional<ProductStock> existingStock = productStockRepository.findByProductIdAndBranchId(
                incomingData.getProduct().getId(),
                incomingData.getBranch().getId()
        );

        ProductStock stockToSave;

        if (existingStock.isPresent()) {
            stockToSave = existingStock.get();
            int newTotal = stockToSave.getQuantity() + incomingData.getQuantity();

            log.debug("Registro de stock existente encontrado. Cantidad actual: {}, Ajuste: {}, Nuevo total previsto: {}",
                    stockToSave.getQuantity(), incomingData.getQuantity(), newTotal);

            if (newTotal < 0) {
                log.warn("Operación cancelada: El ajuste resultaría en stock negativo ({}) para el producto: {}",
                        newTotal, stockToSave.getProduct().getName());
                throw new BusinessException("La operación resultaría en stock negativo para " + stockToSave.getProduct().getName());
            }

            stockToSave.setQuantity(newTotal);
            if (incomingData.getCriticalThreshold() != null) {
                log.info("Actualizando umbral crítico para producto ID: {} a {}", stockToSave.getProduct().getId(), incomingData.getCriticalThreshold());
                stockToSave.setCriticalThreshold(incomingData.getCriticalThreshold());
            }
        } else {
            log.info("No se encontró registro previo. Creando nuevo registro de stock para producto ID: {} en sucursal ID: {}",
                    incomingData.getProduct().getId(), incomingData.getBranch().getId());
            stockToSave = incomingData;
        }

        ProductStock saved = productStockRepository.save(stockToSave);
        log.info("Stock actualizado exitosamente. Nuevo saldo: {} para producto ID: {}", saved.getQuantity(), saved.getProduct().getId());
        return saved;
    }

    public ProductStock getSpecificStock(Long productId, Long branchId) {
        log.debug("Consultando stock específico para producto ID: {} y sucursal ID: {}", productId, branchId);

        return productStockRepository.findByProductIdAndBranchId(productId, branchId)
                .orElseThrow(() -> {
                    log.warn("Consulta de stock fallida: No existe registro para producto {} en sucursal {}", productId, branchId);
                    return new ResourceNotFoundException("No se encontró stock para el producto " + productId + " en la sucursal " + branchId);
                });
    }

    public List<ProductStock> getStockByProduct(Long productId) {
        log.debug("Obteniendo historial de stock en todas las sucursales para el producto ID: {}", productId);
        return productStockRepository.findByProductId(productId);
    }

    public List<ProductStock> getStockByBranch(Long branchId) {
        log.debug("Obteniendo catálogo completo de stock para la sucursal ID: {}", branchId);
        return productStockRepository.findByBranchId(branchId);
    }
}