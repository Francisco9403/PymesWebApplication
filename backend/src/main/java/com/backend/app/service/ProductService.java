package com.backend.app.service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
                        totalStock < minStock,
                        product.getStrategicMultiplier(),
                        product.getStrategicReason(),
                        product.isIgnoreStrategicRules()
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

    public ProductResponse getProductBySku(String sku) {
        Product p = repository.findBySku(sku).orElseThrow(() -> new BusinessException("Product not found with sku: " + sku));

        return new ProductResponse(
            p.getId(),
            p.getSku(),
            p.getName(),
            p.getEan13(),
            p.getBaseCostPrice(),
            p.getCurrentSalePrice()
        );
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


    public void saveStrategicDraft(Long productId, BigDecimal multiplier, String reason) {
        Product product = repository.findById(productId)
                .orElseThrow(() -> new BusinessException("Producto no encontrado"));

        if (!product.isIgnoreStrategicRules()) {
            product.setStrategicMultiplier(multiplier);
            product.setStrategicReason(reason);
            repository.save(product);
        }
    }

    // Método para que el usuario bloquee un producto (Alta rotación/Sobre stock)
    public void toggleProtection(Long productId, boolean ignore) {
        Product product = repository.findById(productId)
                .orElseThrow(() -> new BusinessException("Producto no encontrado"));
        product.setIgnoreStrategicRules(ignore);

        // Si el usuario lo ignora, reseteamos la sugerencia de la IA
        if (ignore) {
            product.setStrategicMultiplier(BigDecimal.ONE);
            product.setStrategicReason(null);
        }
        repository.save(product);
    }
    public void confirmStrategicPrices(Long userId) {
        System.out.println("🚀 Iniciando confirmación para usuario ID: " + userId);

        List<Product> productsToUpdate = repository.findByUserIdAndIgnoreStrategicRulesFalse(userId);

        System.out.println("📦 Productos encontrados para procesar: " + productsToUpdate.size());

        for (Product p : productsToUpdate) {
            System.out.println("🔍 Procesando: " + p.getName() + " | Multiplicador: " + p.getStrategicMultiplier());

            if (p.getStrategicMultiplier() != null && p.getStrategicMultiplier().compareTo(BigDecimal.ONE) > 0) {
                BigDecimal oldPrice = p.getCurrentSalePrice();
                BigDecimal newPrice = oldPrice.multiply(p.getStrategicMultiplier());

                p.setCurrentSalePrice(newPrice);
                p.setStrategicMultiplier(BigDecimal.ONE);
                p.setStrategicReason(null);

                repository.save(p);
                System.out.println("✅ Precio actualizado: " + oldPrice + " -> " + newPrice);
            } else {
                System.out.println("⚠️ Saltado: El multiplicador es 1.0 o null");
            }
        }
    }

    public void saveAIStrategicDrafts(List<Map<String, Object>> suggestions, Long userId) {
        for (Map<String, Object> suggestion : suggestions) {
            String productName = (String) suggestion.get("name");
            BigDecimal multiplier = new BigDecimal(suggestion.get("multiplier").toString());
            String reason = (String) suggestion.get("reason");

            // Buscamos el producto por nombre y usuario
            repository.findByNameAndUserId(productName, userId).ifPresent(product -> {
                if (!product.isIgnoreStrategicRules()) {
                    product.setStrategicMultiplier(multiplier);
                    product.setStrategicReason(reason);
                    repository.save(product);
                }
            });
        }
    }
    public Map<String, BigDecimal> getCurrentPricesForComparison(List<String> names, Long userId) {
        Map<String, BigDecimal> priceMap = new HashMap<>();

        for (String name : names) {
            // Buscamos el producto por nombre y usuario
            repository.findByNameAndUserId(name, userId).ifPresent(product -> {
                // Guardamos el precio de costo actual como "referencia"
                priceMap.put(name, product.getBaseCostPrice());
            });
        }

        return priceMap;
    }
    public List<Product> getProductsBySupplier(Long supplierId) {
        // 🚀 Llamamos al nuevo método con la @Query
        return repository.findBySupplierId(supplierId);
    }


}

