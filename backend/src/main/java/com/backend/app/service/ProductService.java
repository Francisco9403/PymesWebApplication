package com.backend.app.service;

import java.util.Objects;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.app.model.Product;
import com.backend.app.model.ProductStock;
import com.backend.app.model.dto.ProductListResponse;
import com.backend.app.model.dto.ProductSearchCriteria;
import com.backend.app.repository.ProductRepository;
import com.backend.app.specification.ProductSpecification;
import com.backend.app.exception.BusinessException;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Page<ProductListResponse> searchProducts(ProductSearchCriteria criteria, Pageable pageable) {

        Specification<Product> spec = ProductSpecification.search(criteria);
    
        return productRepository
            .findAll(spec, pageable)
            .map(product -> {
    
                Integer totalStock = calculateTotalStock(product);
                Integer minStock = calculateMinStock(product);
    
                return new ProductListResponse(
                    product.getId(),
                    product.getSku(),
                    product.getName(),
                    product.getBaseCostPrice(),
                    product.getCurrentSalePrice(),
                    totalStock,
                    minStock,
                    totalStock < minStock
                );
            });
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Product not found with id: " + id));
    }

    public Product getProductBySku(String sku) {
        return productRepository.findBySku(sku).orElseThrow(() -> new BusinessException("Product not found with sku: " + sku));
    }

    public Product getProductByBarcode(String ean13) {
        // Podríamos hacer una excepción personalizada distinta luego,
        // por ahora reutilizamos la BusinessException genérica.
        return productRepository.findByEan13(ean13)
                .orElseThrow(() -> new BusinessException("Product not found with ean13: " + ean13));
    }

    private Integer calculateTotalStock(Product product) {
        return product.getStocks()
            .stream()
            .map(ProductStock::getQuantity)
            .filter(Objects::nonNull)
            .reduce(0, Integer::sum);
    }
    
    private Integer calculateMinStock(Product product) {
        return product.getStocks()
            .stream()
            .map(ProductStock::getCriticalThreshold)
            .filter(Objects::nonNull)
            .min(Integer::compareTo)
            .orElse(0);
    }
}