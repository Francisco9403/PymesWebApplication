
package com.backend.app.producto.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.backend.app.autentificacion.config.dto.PageResponse;
import com.backend.app.producto.model.Product;
import com.backend.app.producto.model.dto.ProductListResponse;
import com.backend.app.producto.model.dto.ProductResponse;
import com.backend.app.producto.model.dto.ProductSearchCriteria;
import com.backend.app.producto.service.ProductService;
import com.backend.app.usuario.model.User;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Product createProduct(@Valid @RequestBody Product product) {
        return productService.createProduct(product);
    }

    @PutMapping
    @ResponseStatus(HttpStatus.OK)
    public void updateProduct(@Valid @RequestBody ProductResponse request) {
        productService.updateProduct(request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(
            @PathVariable Long id,
            @RequestParam Long branchId,
            Authentication auth
    ) {
        User user = (User) auth.getPrincipal();
        productService.deleteProduct(id, branchId, user.getId());
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public PageResponse<ProductListResponse> getAllProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Boolean belowMinStock,
            @RequestParam(required = false) Long branchId,
            Pageable pageable
    ) {
        // Pasamos el branchId al criteria
        ProductSearchCriteria criteria = new ProductSearchCriteria(name, belowMinStock, branchId);

        return PageResponse.from(
                productService.searchProducts(criteria, pageable)
        );
    }

    @GetMapping("/sku/{sku}")
    @ResponseStatus(HttpStatus.OK)
    public ProductResponse getProductsBySku(@PathVariable String sku) {
        return productService.getProductBySku(sku);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/barcode/{ean13}")
    public ResponseEntity<Product> getProductByBarcode(@PathVariable String ean13) {
        return ResponseEntity.ok(productService.getProductByBarcode(ean13));
    }

    @PostMapping("/confirm-strategic")
    public ResponseEntity<String> confirmStrategicPrices(Authentication auth) {
        User user = (User) auth.getPrincipal();
        productService.confirmStrategicPrices(user.getId());
        return ResponseEntity.ok("Precios estratégicos aplicados con éxito");
    }

    // --- NUEVO ENDPOINT PARA RECIBIR LOS BORRADORES DE LA IA ---
    @PostMapping("/strategic-drafts")
    @ResponseStatus(HttpStatus.OK)
    public void saveDrafts(@RequestBody List<Map<String, Object>> suggestions, Authentication auth) {
        // Obtenemos el usuario logueado para que solo afecte a sus productos
        User user = (User) auth.getPrincipal();


        // Llamamos al método del Service que procesa la lista
        productService.saveAIStrategicDrafts(suggestions, user.getId());
    }

    @PostMapping("/compare-costs")
    @ResponseStatus(HttpStatus.OK)
    public Map<String, BigDecimal> compareCosts(@RequestBody List<String> names, Authentication auth) {
        User user = (User) auth.getPrincipal();

        // Llamamos al service para que haga el trabajo sucio
        return productService.getCurrentPricesForComparison(names, user.getId());
    }

    @GetMapping("/supplier/{supplierId}")
    public ResponseEntity<List<Product>> getProductsBySupplier(
            @PathVariable Long supplierId,
            @RequestParam(required = false) Long branchId
    ) {
        // Necesitaremos ajustar el Service para que acepte este branchId
        List<Product> products = productService.getProductsBySupplier(supplierId, branchId);
        return ResponseEntity.ok(products);
    }


}