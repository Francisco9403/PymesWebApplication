package com.backend.app.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.backend.app.model.Product;
import com.backend.app.model.dto.PageResponse;
import com.backend.app.model.dto.ProductListResponse;
import com.backend.app.model.dto.ProductSearchCriteria;
import com.backend.app.service.ProductService;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Product createProduct(@RequestBody Product product) {
        System.out.println(product);
        return productService.createProduct(product);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public PageResponse<ProductListResponse> getAllProducts(
        @RequestParam(required = false) String name,
        @RequestParam(required = false) Boolean belowMinStock,
        Pageable pageable
    ) {
        ProductSearchCriteria criteria = new ProductSearchCriteria(name, belowMinStock, null);

        return PageResponse.from(
            productService.searchProducts(criteria, pageable)
        );
    }

    @GetMapping("/sku/{sku}")
    @ResponseStatus(HttpStatus.OK)
    public Product getProductsBySku(@PathVariable String sku) {
        return productService.getProductBySku(sku);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    // Endpoint específico para la pistola lectora de códigos o la cámara del celu
    @GetMapping("/barcode/{ean13}")
    public ResponseEntity<Product> getProductByBarcode(@PathVariable String ean13) {
        return ResponseEntity.ok(productService.getProductByBarcode(ean13));
    }
}