package com.backend.app.producto.service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.app.producto.model.Product;
import com.backend.app.producto.model.ProductStock;
import com.backend.app.producto.model.dto.ProductListResponse;
import com.backend.app.producto.model.dto.ProductResponse;
import com.backend.app.producto.model.dto.ProductSearchCriteria;
import com.backend.app.producto.repository.ProductRepository;
import com.backend.app.producto.repository.ProductStockRepository;
import com.backend.app.producto.specificacion.ProductSpecification;
import com.backend.app.exception.BusinessException;
import com.backend.app.exception.ResourceNotFoundException;

@Service
@Transactional
public class ProductService {

    private static final Logger log = LoggerFactory.getLogger(ProductService.class);

    private final ProductRepository repository;
    private final ProductStockRepository stockRepository;

    public ProductService(ProductRepository repository, ProductStockRepository stockRepository) {
        this.repository = repository;
        this.stockRepository = stockRepository;
    }

    public Product createProduct(Product product) {
        log.info("Iniciando creación de producto: {}", product.getName());

        if (product.getBaseCostPrice() != null && product.getBaseCostPrice().compareTo(BigDecimal.ZERO) < 0) {
            log.warn("Intento de creación fallido: Precio de costo negativo para el producto '{}'", product.getName());
            throw new BusinessException("El precio de costo no puede ser negativo");
        }

        Product savedProduct = repository.save(product);
        log.info("Producto creado exitosamente con ID: {}", savedProduct.getId());
        return savedProduct;
    }

    public void updateProduct(ProductResponse request) {
        log.info("Iniciando actualización del producto ID: {}", request.id());

        Product product = repository.findById(request.id())
                .orElseThrow(() -> {
                    log.error("Error al actualizar: No se encontró el producto con ID: {}", request.id());
                    return new ResourceNotFoundException("Producto no encontrado con ID: " + request.id());
                });

        if (request.currentSalePrice().compareTo(request.baseCostPrice()) < 0) {
            log.warn("Violación de regla de negocio: Precio de venta ({}) menor al costo ({}) para ID: {}",
                    request.currentSalePrice(), request.baseCostPrice(), request.id());
            throw new BusinessException("El precio de venta no puede ser menor al costo");
        }

        product.setSku(request.sku());
        product.setEan13(request.ean13());
        product.setName(request.name());
        product.setBaseCostPrice(request.baseCostPrice());
        product.setCurrentSalePrice(request.currentSalePrice());

        repository.save(product);
        log.info("Producto ID: {} actualizado correctamente", request.id());
    }

    public Page<ProductListResponse> searchProducts(ProductSearchCriteria criteria, Pageable pageable) {
        log.debug("Ejecutando búsqueda de productos. Criterios: {}", criteria);

        Specification<Product> spec = ProductSpecification.search(criteria);

        return repository
                .findAll(spec, pageable)
                .map(product -> {
                    Integer totalStock;
                    Integer minStock;

                    // 🚀 Lógica Multi-sucursal: Filtramos stock solo de la elegida o mostramos global
                    if (criteria.branchId() != null) {
                        totalStock = product.getStocks().stream()
                                .filter(s -> s.getBranch() != null && s.getBranch().getId().equals(criteria.branchId()))
                                .map(ProductStock::getQuantity)
                                .filter(Objects::nonNull)
                                .findFirst()
                                .orElse(0);

                        minStock = product.getStocks().stream()
                                .filter(s -> s.getBranch() != null && s.getBranch().getId().equals(criteria.branchId()))
                                .map(ProductStock::getCriticalThreshold)
                                .filter(Objects::nonNull)
                                .findFirst()
                                .orElse(0);
                    } else {
                        totalStock = calculateTotalStock(product);
                        minStock = calculateMinStock(product);
                    }

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
        log.info("Solicitud de eliminación de producto ID: {} en sucursal: {}", productId, branchId);

        Product product = repository
                .findByIdAndUserId(productId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado o no pertenece al usuario"));

        ProductStock stock = stockRepository
                .findByProductIdAndBranchId(productId, branchId)
                .orElseThrow(() -> new ResourceNotFoundException("No hay registros de stock para este producto en la sucursal seleccionada"));

        stockRepository.delete(stock);
        log.info("Registro de stock eliminado para la sucursal ID: {}", branchId);

        // Si ya no quedan registros de stock en NINGUNA sucursal, borramos el producto del catálogo global
        long remainingStocks = stockRepository.countByProductId(productId);
        if (remainingStocks == 0) {
            log.info("El producto ID: {} ya no tiene stocks asociados. Eliminando del catálogo global.", productId);
            product.getSuppliers().clear();
            repository.delete(product);
        }
    }

    public Product getProductById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto con ID " + id + " no existe"));
    }

    public ProductResponse getProductBySku(String sku) {
        Product p = repository.findBySku(sku)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró producto con SKU: " + sku));

        return new ProductResponse(
                p.getId(), p.getSku(), p.getName(), p.getEan13(), p.getBaseCostPrice(), p.getCurrentSalePrice()
        );
    }

    public Product getProductByBarcode(String ean13) {
        return repository.findByEan13(ean13)
                .orElseThrow(() -> new ResourceNotFoundException("Código de barras " + ean13 + " no registrado"));
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

    public List<Product> getProductsBySupplier(Long supplierId, Long branchId) {
        log.debug("Buscando productos del proveedor {} para la sucursal {}", supplierId, branchId);
        if (branchId != null) {
            return repository.findBySupplierIdAndBranchId(supplierId, branchId);
        }
        return repository.findBySupplierId(supplierId);
    }

    // --- MÉTODOS ESTRATÉGICOS E IA ---

    public void saveStrategicDraft(Long productId, BigDecimal multiplier, String reason) {
        Product product = repository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));

        if (!product.isIgnoreStrategicRules()) {
            product.setStrategicMultiplier(multiplier);
            product.setStrategicReason(reason);
            repository.save(product);
        }
    }

    public void toggleProtection(Long productId, boolean ignore) {
        Product product = repository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Producto inexistente"));

        product.setIgnoreStrategicRules(ignore);
        if (ignore) {
            product.setStrategicMultiplier(BigDecimal.ONE);
            product.setStrategicReason(null);
        }
        repository.save(product);
    }

    public void confirmStrategicPrices(Long userId) {
        List<Product> productsToUpdate = repository.findByUserIdAndIgnoreStrategicRulesFalse(userId);
        for (Product p : productsToUpdate) {
            if (p.getStrategicMultiplier() != null && p.getStrategicMultiplier().compareTo(BigDecimal.ONE) > 0) {
                p.setCurrentSalePrice(p.getCurrentSalePrice().multiply(p.getStrategicMultiplier()));
                p.setStrategicMultiplier(BigDecimal.ONE);
                p.setStrategicReason(null);
                repository.save(p);
            }
        }
    }

    public void saveAIStrategicDrafts(List<Map<String, Object>> suggestions, Long userId) {
        for (Map<String, Object> suggestion : suggestions) {
            String productName = (String) suggestion.get("name");
            BigDecimal multiplier = new BigDecimal(suggestion.get("multiplier").toString());
            String reason = (String) suggestion.get("reason");

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
            repository.findByNameAndUserId(name, userId).ifPresent(p -> priceMap.put(name, p.getBaseCostPrice()));
        }
        return priceMap;
    }
}