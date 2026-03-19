package com.backend.app.venta.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory; // 🚀 Importaciones de SLF4J
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.app.cliente.model.Customer;
import com.backend.app.cliente.repository.CustomerRepository;
import com.backend.app.exception.BusinessException;
import com.backend.app.exception.InsufficientStockException;
import com.backend.app.exception.ResourceNotFoundException;
import com.backend.app.producto.model.Product;
import com.backend.app.producto.model.ProductStock;
import com.backend.app.producto.repository.ProductRepository;
import com.backend.app.producto.repository.ProductStockRepository;
import com.backend.app.sucursal.model.Branch;
import com.backend.app.sucursal.respository.BranchRepository;
import com.backend.app.venta.model.Sale;
import com.backend.app.venta.model.SaleItem;
import com.backend.app.venta.model.SaleStatus;
import com.backend.app.venta.model.dto.CreateSaleItemRequest;
import com.backend.app.venta.model.dto.CreateSaleRequest;
import com.backend.app.venta.repository.SaleRepository;

@Service
public class SaleService {

    // 🚀 Definición del Logger
    private static final Logger log = LoggerFactory.getLogger(SaleService.class);

    private final SaleRepository repository;
    private final ProductRepository productRepository;
    private final BranchRepository branchRepository;
    private final CustomerRepository customerRepository;
    private final ProductStockRepository productStockRepository;

    public SaleService(SaleRepository repository, ProductRepository productRepository,
                       BranchRepository branchRepository, CustomerRepository customerRepository,
                       ProductStockRepository productStockRepository) {
        this.repository = repository;
        this.productRepository = productRepository;
        this.branchRepository = branchRepository;
        this.customerRepository = customerRepository;
        this.productStockRepository = productStockRepository;
    }

    @Transactional
    public Sale createSale(CreateSaleRequest request) {
        log.info("🚀 Iniciando creación de venta. Sucursal ID: {}, Canal: {}", request.branchId(), request.channel());

        // 1. Validar que la venta no venga vacía
        if (request.items() == null || request.items().isEmpty()) {
            log.warn("Intento de venta fallido: La lista de productos está vacía.");
            throw new BusinessException("No se puede registrar una venta sin productos");
        }

        // 2. Buscar Sucursal (404 si no existe)
        Branch branch = branchRepository.findById(request.branchId())
                .orElseThrow(() -> {
                    log.error("Fallo en venta: Sucursal ID {} no encontrada", request.branchId());
                    return new ResourceNotFoundException("Sucursal no encontrada con ID: " + request.branchId());
                });

        Customer customer = null;
        if (request.customerId() != null) {
            customer = customerRepository.findById(request.customerId())
                    .orElseThrow(() -> {
                        log.error("Fallo en venta: Cliente ID {} no encontrado", request.customerId());
                        return new ResourceNotFoundException("Cliente no encontrado con ID: " + request.customerId());
                    });
            log.info("Venta vinculada al cliente: {} (ID: {})", customer.getName(), customer.getId());
        }

        Sale sale = new Sale();
        sale.setBranch(branch);
        sale.setChannel(request.channel());
        sale.setCreatedAt(LocalDateTime.now());
        sale.setCustomer(customer);

        List<SaleItem> items = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;
        BigDecimal totalCost = BigDecimal.ZERO;
        int totalItems = 0;

        for (CreateSaleItemRequest itemRequest : request.items()) {
            // 3. Buscar Producto
            Product product = productRepository.findById(itemRequest.productId())
                    .orElseThrow(() -> {
                        log.error("Error en item de venta: Producto ID {} no existe", itemRequest.productId());
                        return new ResourceNotFoundException("Producto no encontrado con ID: " + itemRequest.productId());
                    });

            int quantity = itemRequest.quantity();
            log.debug("Procesando item: {} x{}", product.getName(), quantity);

            if (quantity <= 0) {
                log.warn("Cantidad inválida para producto {}: {}", product.getName(), quantity);
                throw new BusinessException("La cantidad del producto " + product.getName() + " debe ser mayor a cero");
            }

            // 4. Validar Stock 🚀
            ProductStock stock = productStockRepository
                    .findByProductAndBranch(product, branch)
                    .orElseThrow(() -> {
                        log.error("Error de inventario: Producto '{}' no tiene registro de stock en sucursal {}", product.getName(), branch.getName());
                        return new BusinessException("El producto " + product.getName() + " no tiene registro de stock en esta sucursal");
                    });

            if (stock.getQuantity() < quantity) {
                log.warn("Venta rechazada por falta de stock: {} (Pedido: {}, Disponible: {})",
                        product.getName(), quantity, stock.getQuantity());
                throw new InsufficientStockException(product.getName(), quantity, stock.getQuantity());
            }

            BigDecimal price = product.getCurrentSalePrice();
            BigDecimal cost = product.getBaseCostPrice();
            BigDecimal subtotal = price.multiply(BigDecimal.valueOf(quantity));

            SaleItem item = new SaleItem();
            item.setSale(sale);
            item.setProduct(product);
            item.setProductName(product.getName());
            item.setProductSku(product.getSku());
            item.setQuantity(quantity);
            item.setPriceAtSale(price);
            item.setCostAtSale(cost);
            item.setSubtotal(subtotal);

            items.add(item);

            totalAmount = totalAmount.add(subtotal);
            totalCost = totalCost.add(cost.multiply(BigDecimal.valueOf(quantity)));
            totalItems += quantity;

            // Descontar stock de forma segura
            int newStockQty = stock.getQuantity() - quantity;
            log.debug("Actualizando stock para {}: {} -> {}", product.getName(), stock.getQuantity(), newStockQty);
            stock.setQuantity(newStockQty);
        }

        sale.setItems(items);
        sale.setTotalAmount(totalAmount);
        sale.setTotalCost(totalCost);
        sale.setProfit(totalAmount.subtract(totalCost));
        sale.setTotalItems(totalItems);
        sale.setStatus(SaleStatus.COMPLETED);

        // 5. Actualizar deuda del cliente si corresponde
        if (customer != null) {
            BigDecimal oldDebt = customer.getCurrentDebt() != null ? customer.getCurrentDebt() : BigDecimal.ZERO;
            customer.setCurrentDebt(oldDebt.add(totalAmount));
            log.info("Deuda de cliente '{}' actualizada: ${} -> ${}", customer.getName(), oldDebt, customer.getCurrentDebt());
        }

        Sale savedSale = repository.save(sale);
        log.info("Venta ID: {} completada con éxito. Total: ${}, Items: {}", savedSale.getId(), totalAmount, totalItems);

        return savedSale;
    }

    public List<Sale> getSalesByMonth(int month, int year) {
        log.info("Generando reporte de ventas para el periodo: {}/{}", month, year);

        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDateTime start = yearMonth.atDay(1).atStartOfDay();
        LocalDateTime end = yearMonth.atEndOfMonth().atTime(LocalTime.MAX);

        List<Sale> sales = repository.findByCreatedAtBetweenAndFiscalReceiptIsNotNull(start, end);
        log.debug("Se encontraron {} ventas fiscalizadas para el reporte.", sales.size());

        return sales;
    }

    public Sale createSale(Sale sale) {
        log.debug("Creando registro de venta directa...");
        sale.setCreatedAt(LocalDateTime.now());
        return repository.save(sale);
    }

    public List<Sale> getSalesByBranch(Long branchId) {
        log.debug("Consultando ventas para la sucursal ID: {}", branchId);
        return repository.findByBranchId(branchId);
    }

    public Sale getSaleById(Long id) {
        log.debug("Buscando venta ID: {}", id);
        return repository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Consulta fallida: Venta ID {} no encontrada", id);
                    return new ResourceNotFoundException("No se encontró la venta con ID: " + id);
                });
    }

    public BigDecimal getTotalPerceptionsByMonth(int month, int year) {
        log.info("Calculando total de percepciones para el periodo: {}/{}", month, year);
        List<Sale> sales = getSalesByMonth(month, year);

        BigDecimal totalPerceptions = sales.stream()
                .map(s -> s.getFiscalReceipt().getIibbPerception())
                .filter(java.util.Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        log.info("Total de percepciones calculado: ${}", totalPerceptions);
        return totalPerceptions;
    }

}