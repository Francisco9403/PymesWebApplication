package com.backend.app.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.backend.app.model.ProductStock;
import com.backend.app.model.Product;
import com.backend.app.model.Branch;
import com.backend.app.repository.ProductStockRepository;
import com.backend.app.repository.ProductRepository;
import com.backend.app.repository.BranchRepository;
import com.backend.app.exception.BusinessException;

@Service
public class ProductStockService {

    private final ProductStockRepository productStockRepository;
    private final ProductRepository productRepository; // Para buscar el producto real
    private final BranchRepository branchRepository;   // Para buscar la sucursal real

    public ProductStockService(ProductStockRepository productStockRepository,
                               ProductRepository productRepository,
                               BranchRepository branchRepository) {
        this.productStockRepository = productStockRepository;
        this.productRepository = productRepository;
        this.branchRepository = branchRepository;
    }

    public ProductStock saveOrUpdateStock(ProductStock productStock) {
        // 1. Obtenemos los IDs que mandó el frontend
        Long productId = productStock.getProduct().getId();
        Long branchId = productStock.getBranch().getId();

        // 2. Buscamos si ya existe stock de ese producto en esa sucursal
        Optional<ProductStock> existingStockOpt = productStockRepository.findByProductIdAndBranchId(productId, branchId);

        if (existingStockOpt.isPresent()) {
            // SI YA EXISTE: Le sumamos la cantidad nueva a la que ya había
            ProductStock existingStock = existingStockOpt.get();
            existingStock.setQuantity(existingStock.getQuantity() + productStock.getQuantity());

            // Actualizamos el umbral crítico si lo mandaron
            if (productStock.getCriticalThreshold() != null) {
                existingStock.setCriticalThreshold(productStock.getCriticalThreshold());
            }
            return productStockRepository.save(existingStock);

        } else {
            // SI NO EXISTE: Es mercadería nueva. Buscamos las entidades reales en la BD.
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new BusinessException(productId));

            Branch branch = branchRepository.findById(branchId)
                    .orElseThrow(() -> new BusinessException(branchId));

            // Atamos los objetos reales a nuestro registro y guardamos
            productStock.setProduct(product);
            productStock.setBranch(branch);
            return productStockRepository.save(productStock);
        }
    }

    public List<ProductStock> getStockByProduct(Long productId) {
        return productStockRepository.findByProductId(productId);
    }

    public List<ProductStock> getStockByBranch(Long branchId) {
        return productStockRepository.findByBranchId(branchId);
    }

    public ProductStock getSpecificStock(Long productId, Long branchId) {
        return productStockRepository.findByProductIdAndBranchId(productId, branchId)
                .orElseThrow(() -> new BusinessException(productId));
    }
}