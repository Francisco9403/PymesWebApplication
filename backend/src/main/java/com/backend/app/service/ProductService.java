package com.backend.app.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.app.model.Product;
import com.backend.app.model.dto.ProductResponse;
import com.backend.app.repository.ProductRepository;
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

    public Page<ProductResponse> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable)
            .map(p -> new ProductResponse(
                p.getId(),
                p.getSku(),
                p.getCurrentSalePrice()
            ));
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new BusinessException(id));
    }

    public ProductResponse getProductBySku(String sku) {
        Product product = productRepository.findBySku(sku).orElseThrow(() -> new BusinessException(0L));
        return new ProductResponse(product.getId(), product.getSku(), product.getCurrentSalePrice());
    }

    public Product getProductByBarcode(String ean13) {
        // Podríamos hacer una excepción personalizada distinta luego,
        // por ahora reutilizamos la BusinessException genérica.
        return productRepository.findByEan13(ean13)
                .orElseThrow(() -> new BusinessException(0L));
    }
}