package com.backend.app.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.backend.app.model.ProductStock;
import com.backend.app.repository.ProductStockRepository;

import jakarta.transaction.Transactional;

import com.backend.app.exception.BusinessException;

@Service
@Transactional
public class ProductStockService {

    private final ProductStockRepository productStockRepository;

    public ProductStockService(ProductStockRepository productStockRepository) {
        this.productStockRepository = productStockRepository;
    }

    public ProductStock updateStockQuantity(ProductStock incomingData) {
        if (incomingData.getProduct() == null || incomingData.getBranch() == null) {
            throw new RuntimeException("Datos de producto o sucursal incompletos");
        }

        // 1. Buscar si ya existe el stock para ese producto en esa sucursal
        Optional<ProductStock> existingStock = productStockRepository.findByProductIdAndBranchId(
            incomingData.getProduct().getId(), 
            incomingData.getBranch().getId()
        );

        ProductStock stockToSave;

        if (existingStock.isPresent()) {
            // Caso PATCH: Actualizamos el registro existente
            stockToSave = existingStock.get();
            
            // Sumamos la cantidad nueva a la actual
            int newTotal = stockToSave.getQuantity() + incomingData.getQuantity();
            stockToSave.setQuantity(newTotal);
            
            // Actualizamos el umbral crítico si viene en el payload
            if (incomingData.getCriticalThreshold() != null) {
                stockToSave.setCriticalThreshold(incomingData.getCriticalThreshold());
            }
        } else {
            // Caso Upsert: Si no existe, lo creamos de cero
            stockToSave = incomingData;
        }

        // Aquí podrías disparar la lógica de "Alerta Predictiva" si newTotal <= criticalThreshold
        return productStockRepository.save(stockToSave);
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
                .orElseThrow(() -> new BusinessException("ProductStock not found with id: " + productId + " and branch id: " + branchId));
    }
}