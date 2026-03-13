package com.backend.app.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

import com.backend.app.exception.InsufficientStockException;
import com.backend.app.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.app.model.Branch;
import com.backend.app.model.Customer;
import com.backend.app.model.Product;
import com.backend.app.model.ProductStock;
import com.backend.app.model.Sale;
import com.backend.app.model.SaleItem;
import com.backend.app.model.SaleStatus;
import com.backend.app.model.dto.CreateSaleItemRequest;
import com.backend.app.model.dto.CreateSaleRequest;
import com.backend.app.repository.BranchRepository;
import com.backend.app.repository.CustomerRepository;
import com.backend.app.repository.ProductRepository;
import com.backend.app.repository.ProductStockRepository;
import com.backend.app.repository.SaleRepository;
import com.backend.app.exception.BusinessException;

@Service
public class SaleService {

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
        // 1. Validar que la venta no venga vacía
        if (request.items() == null || request.items().isEmpty()) {
            throw new BusinessException("No se puede registrar una venta sin productos");
        }

        // 2. Buscar Sucursal (404 si no existe)
        Branch branch = branchRepository.findById(request.branchId())
                .orElseThrow(() -> new ResourceNotFoundException("Sucursal no encontrada con ID: " + request.branchId()));

        Customer customer = null;
        if (request.customerId() != null) {
            customer = customerRepository.findById(request.customerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con ID: " + request.customerId()));
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
                    .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + itemRequest.productId()));

            int quantity = itemRequest.quantity();
            if (quantity <= 0) {
                throw new BusinessException("La cantidad del producto " + product.getName() + " debe ser mayor a cero");
            }

            // 4. Validar Stock 🚀
            ProductStock stock = productStockRepository
                    .findByProductAndBranch(product, branch)
                    .orElseThrow(() -> new BusinessException("El producto " + product.getName() + " no tiene registro de stock en esta sucursal"));

            if (stock.getQuantity() < quantity) {
                // 🚀 Pasamos los 3 datos: Nombre, Pedido, Disponible
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
            stock.setQuantity(stock.getQuantity() - quantity);
        }

        sale.setItems(items);
        sale.setTotalAmount(totalAmount);
        sale.setTotalCost(totalCost);
        sale.setProfit(totalAmount.subtract(totalCost));
        sale.setTotalItems(totalItems);
        sale.setStatus(SaleStatus.COMPLETED);

        // 5. Actualizar deuda del cliente si corresponde
        if (customer != null) {
            BigDecimal currentDebt = customer.getCurrentDebt() != null ? customer.getCurrentDebt() : BigDecimal.ZERO;
            customer.setCurrentDebt(currentDebt.add(totalAmount));
        }

        return repository.save(sale);
    }

    // Nuevo método para el reporte de Finanzas
    public List<Sale> getSalesByMonth(int month, int year) {
        // Calculamos el inicio y fin del mes
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDateTime start = yearMonth.atDay(1).atStartOfDay();
        LocalDateTime end = yearMonth.atEndOfMonth().atTime(LocalTime.MAX);

        return repository.findByCreatedAtBetweenAndFiscalReceiptIsNotNull(start, end);
    }

    public Sale createSale(Sale sale) {
        sale.setCreatedAt(LocalDateTime.now());
        // Por defecto, si hay FiscalReceipt, quizás ya debería estar COMPLETED
        return repository.save(sale);
    }

    public List<Sale> getSalesByBranch(Long branchId) {
        return repository.findByBranchId(branchId);
    }

    public Sale getSaleById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró la venta con ID: " + id));
    }

    // En SaleService.java
    public BigDecimal getTotalPerceptionsByMonth(int month, int year) {
        List<Sale> sales = getSalesByMonth(month, year);
        return sales.stream()
                .map(s -> s.getFiscalReceipt().getIibbPerception())
                .filter(java.util.Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

}