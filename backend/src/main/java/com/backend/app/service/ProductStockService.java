package com.backend.app.service;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.backend.app.model.ProductStock;
import com.backend.app.repository.ProductStockRepository;
import com.backend.app.exception.BusinessException; // 🚀 Para datos incompletos
import com.backend.app.exception.ResourceNotFoundException; // 🚀 Para búsquedas fallidas

@Service
@Transactional
public class ProductStockService {

    private final ProductStockRepository productStockRepository;

    public ProductStockService(ProductStockRepository productStockRepository) {
        this.productStockRepository = productStockRepository;
    }

    public ProductStock updateStockQuantity(ProductStock incomingData) {
        if (incomingData.getProduct() == null || incomingData.getBranch() == null) {
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

            // Validación extra: No permitir stock negativo por ajuste manual
            if (newTotal < 0) {
                throw new BusinessException("La operación resultaría en stock negativo para " + stockToSave.getProduct().getName());
            }

            stockToSave.setQuantity(newTotal);
            if (incomingData.getCriticalThreshold() != null) {
                stockToSave.setCriticalThreshold(incomingData.getCriticalThreshold());
            }
        } else {
            stockToSave = incomingData;
        }

        return productStockRepository.save(stockToSave);
    }

    public ProductStock getSpecificStock(Long productId, Long branchId) {
        // 🚀 Ahora retorna 404 con detalle exacto
        return productStockRepository.findByProductIdAndBranchId(productId, branchId)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró stock para el producto " + productId + " en la sucursal " + branchId));
    }

    public List<ProductStock> getStockByProduct(Long productId) {
        return productStockRepository.findByProductId(productId);
    }

    public List<ProductStock> getStockByBranch(Long branchId) {
        return productStockRepository.findByBranchId(branchId);
    }
}