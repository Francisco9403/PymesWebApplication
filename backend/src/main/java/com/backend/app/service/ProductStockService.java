package com.backend.app.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.backend.app.model.ProductStock;
import com.backend.app.repository.ProductStockRepository;
import com.backend.app.exception.BusinessException;

@Service
public class ProductStockService {

    private final ProductStockRepository productStockRepository;

    public ProductStockService(ProductStockRepository productStockRepository) {
        this.productStockRepository = productStockRepository;
    }

    public ProductStock saveOrUpdateStock(ProductStock productStock) {
        // En una versión más avanzada, acá se revisaría si el stock bajó del criticalThreshold
        // para disparar una Alerta Predictiva.
        return productStockRepository.save(productStock);
    }

    public List<ProductStock> getStockByProduct(Long productId) {
        return productStockRepository.findByProductId(productId);
    }

    public List<ProductStock> getStockByBranch(Long branchId) {
        return productStockRepository.findByBranchId(branchId);
    }

    public ProductStock getSpecificStock(Long productId, Long branchId) {
        return productStockRepository.findByProductIdAndBranchId(productId, branchId)
                // Usamos la misma excepción, después pueden crear una propia tipo "StockNotFoundException"
                .orElseThrow(() -> new BusinessException(productId));
    }
}