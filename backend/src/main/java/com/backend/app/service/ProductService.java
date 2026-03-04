package com.backend.app.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.backend.app.model.Product;
import com.backend.app.repository.ProductRepository;
import com.backend.app.exception.BusinessException;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new BusinessException(id));
    }

    public Product getProductByBarcode(String ean13) {
        // Podríamos hacer una excepción personalizada distinta luego,
        // por ahora reutilizamos la BusinessException genérica.
        return productRepository.findByEan13(ean13)
                .orElseThrow(() -> new BusinessException(0L));
    }
}