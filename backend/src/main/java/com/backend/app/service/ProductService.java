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
import com.backend.app.model.dto.ProductResponse;
import com.backend.app.model.dto.ProductSearchCriteria;
import com.backend.app.repository.ProductRepository;
import com.backend.app.repository.ProductStockRepository;
import com.backend.app.specification.ProductSpecification;
import com.backend.app.exception.BusinessException;

@Service
@Transactional
public class ProductService {

    private final ProductRepository repository;
    private final ProductStockRepository stockRepository;

    public ProductService(ProductRepository repository, ProductStockRepository stockRepository) {
        this.repository = repository;
        this.stockRepository = stockRepository;
    }

    public Product createProduct(Product product) {
        return repository.save(product);
    }

    public void updateProduct(ProductResponse request) {
        Product product = repository.findById(request.id())
            .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setSku(request.sku());
        product.setEan13(request.ean13());
        product.setName(request.name());
        product.setBaseCostPrice(request.baseCostPrice());
        product.setCurrentSalePrice(request.currentSalePrice());

        repository.save(product);
    }

    public Page<ProductListResponse> searchProducts(ProductSearchCriteria criteria, Pageable pageable) {

        Specification<Product> spec = ProductSpecification.search(criteria);
    
        return repository
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

    public void deleteProduct(Long productId, Long branchId, Long userId) {
    
        Product product = repository
                .findByIdAndUserId(productId, userId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        ProductStock stock = stockRepository
                .findByProductIdAndBranchId(productId, branchId)
                .orElseThrow(() -> new RuntimeException("Stock no encontrado en sucursal"));

        // eliminar stock de la sucursal
        stockRepository.delete(stock);

        // verificar si quedan stocks
        long remainingStocks = stockRepository.countByProductId(productId);

        if (remainingStocks == 0) {

            // limpiar relación many-to-many
            product.getSuppliers().clear();

            // eliminar producto completo
            repository.delete(product);
        }
    }

    public Product getProductById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new BusinessException("Product not found with id: " + id));
    }

    public Product getProductBySku(String sku) {
        return repository.findBySku(sku).orElseThrow(() -> new BusinessException("Product not found with sku: " + sku));
    }

    public Product getProductByBarcode(String ean13) {
        // Podríamos hacer una excepción personalizada distinta luego,
        // por ahora reutilizamos la BusinessException genérica.
        return repository.findByEan13(ean13)
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