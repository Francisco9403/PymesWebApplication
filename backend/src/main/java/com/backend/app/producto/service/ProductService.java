package com.backend.app.producto.service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory; // 🚀 Importaciones de SLF4J
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

    // 🚀 Definición del Logger para esta clase
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
            log.warn("Violación de regla de negocio en Junín: Precio de venta ({}) menor al costo ({}) para ID: {}",
                    request.currentSalePrice(), request.baseCostPrice(), request.id());
            throw new BusinessException("Alerta en Junín: El precio de venta no puede ser menor al costo");
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
        log.debug("Ejecutando búsqueda de productos con criterios: {}", criteria);

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
        log.info("Solicitud de eliminación de producto ID: {} por usuario ID: {} en sucursal: {}", productId, userId, branchId);

        Product product = repository
                .findByIdAndUserId(productId, userId)
                .orElseThrow(() -> {
                    log.warn("Acceso denegado o inexistente: Usuario {} intentó borrar producto {}", userId, productId);
                    return new ResourceNotFoundException("Producto no encontrado o no pertenece al usuario");
                });

        ProductStock stock = stockRepository
                .findByProductIdAndBranchId(productId, branchId)
                .orElseThrow(() -> {
                    log.error("Fallo al borrar: No hay stock registrado para el producto {} en la sucursal {}", productId, branchId);
                    return new ResourceNotFoundException("No hay registros de stock para este producto en la sucursal seleccionada");
                });

        stockRepository.delete(stock);
        log.info("Registro de stock eliminado para el producto ID: {}", productId);

        long remainingStocks = stockRepository.countByProductId(productId);
        if (remainingStocks == 0) {
            log.info("El producto ID: {} no tiene más stocks asociados. Procediendo a eliminación total.", productId);
            product.getSuppliers().clear();
            repository.delete(product);
            log.info("Producto ID: {} eliminado definitivamente de la base de datos.", productId);
        }
    }

    public Product getProductById(Long id) {
        log.debug("Consultando producto por ID: {}", id);
        return repository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Consulta fallida: El producto con ID {} no existe", id);
                    return new ResourceNotFoundException("Producto con ID " + id + " no existe");
                });
    }

    public ProductResponse getProductBySku(String sku) {
        log.debug("Consultando producto por SKU: {}", sku);
        Product p = repository.findBySku(sku)
                .orElseThrow(() -> {
                    log.warn("Consulta por SKU fallida: {}", sku);
                    return new ResourceNotFoundException("No se encontró producto con SKU: " + sku);
                });

        return new ProductResponse(
                p.getId(), p.getSku(), p.getName(), p.getEan13(), p.getBaseCostPrice(), p.getCurrentSalePrice()
        );
    }

    public Product getProductByBarcode(String ean13) {
        log.debug("Consultando producto por código de barras: {}", ean13);
        return repository.findByEan13(ean13)
                .orElseThrow(() -> {
                    log.warn("Consulta por EAN fallida: {}", ean13);
                    return new ResourceNotFoundException("Código de barras " + ean13 + " no registrado");
                });
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
        log.info("Guardando borrador estratégico para producto ID: {}", productId);

        Product product = repository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("No se puede guardar borrador: Producto no encontrado"));

        if (multiplier.compareTo(BigDecimal.ZERO) <= 0) {
            log.warn("Intento de borrador con multiplicador inválido: {} para producto ID: {}", multiplier, productId);
            throw new BusinessException("El multiplicador estratégico debe ser mayor a cero");
        }

        if (!product.isIgnoreStrategicRules()) {
            product.setStrategicMultiplier(multiplier);
            product.setStrategicReason(reason);
            repository.save(product);
            log.info("Borrador estratégico guardado con éxito para ID: {}", productId);
        } else {
            log.info("Borrador ignorado: El producto ID: {} tiene activada la protección de reglas.", productId);
        }
    }

    public void toggleProtection(Long productId, boolean ignore) {
        log.info("Cambiando estado de protección para producto ID: {} a {}", productId, ignore);

        Product product = repository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Error al cambiar protección: Producto inexistente"));

        product.setIgnoreStrategicRules(ignore);
        if (ignore) {
            log.debug("Reseteando multiplicador estratégico por activación de protección en ID: {}", productId);
            product.setStrategicMultiplier(BigDecimal.ONE);
            product.setStrategicReason(null);
        }
        repository.save(product);
    }

    public void confirmStrategicPrices(Long userId) {
        log.info("🚀 Iniciando confirmación masiva de precios estratégicos para usuario ID: {}", userId);

        List<Product> productsToUpdate = repository.findByUserIdAndIgnoreStrategicRulesFalse(userId);
        log.info("📦 Encontrados {} productos para actualizar precios.", productsToUpdate.size());

        int updatedCount = 0;
        for (Product p : productsToUpdate) {
            if (p.getStrategicMultiplier() != null && p.getStrategicMultiplier().compareTo(BigDecimal.ONE) > 0) {
                BigDecimal oldPrice = p.getCurrentSalePrice();
                BigDecimal newPrice = oldPrice.multiply(p.getStrategicMultiplier());

                p.setCurrentSalePrice(newPrice);
                p.setStrategicMultiplier(BigDecimal.ONE);
                p.setStrategicReason(null);

                repository.save(p);
                updatedCount++;
                log.info("Precio actualizado para '{}': {} -> {}", p.getName(), oldPrice, newPrice);
            }
        }
        log.info("Proceso finalizado. Se actualizaron {} productos para el usuario {}.", updatedCount, userId);
    }

    public void saveAIStrategicDrafts(List<Map<String, Object>> suggestions, Long userId) {
        log.info("Procesando {} sugerencias de IA para el usuario ID: {}", suggestions.size(), userId);

        for (Map<String, Object> suggestion : suggestions) {
            String productName = (String) suggestion.get("name");
            BigDecimal multiplier = new BigDecimal(suggestion.get("multiplier").toString());
            String reason = (String) suggestion.get("reason");

            repository.findByNameAndUserId(productName, userId).ifPresentOrElse(product -> {
                if (!product.isIgnoreStrategicRules()) {
                    product.setStrategicMultiplier(multiplier);
                    product.setStrategicReason(reason);
                    repository.save(product);
                    log.debug("Sugerencia de IA aplicada correctamente a: {}", productName);
                }
            }, () -> log.warn("La IA sugirió un producto que no se encontró o no pertenece al usuario: {}", productName));
        }
    }

    public Map<String, BigDecimal> getCurrentPricesForComparison(List<String> names, Long userId) {
        log.debug("Obteniendo precios actuales para comparación de {} productos.", names.size());
        Map<String, BigDecimal> priceMap = new HashMap<>();

        for (String name : names) {
            repository.findByNameAndUserId(name, userId).ifPresent(product -> {
                priceMap.put(name, product.getBaseCostPrice());
            });
        }
        return priceMap;
    }

    public List<Product> getProductsBySupplier(Long supplierId) {
        log.debug("Buscando productos asociados al proveedor ID: {}", supplierId);
        return repository.findBySupplierId(supplierId);
    }
}