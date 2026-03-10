package com.backend.app.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
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

        Branch branch = branchRepository.findById(request.branchId())
                .orElseThrow();

        Customer customer = null;

        if (request.customerId() != null) {
            customer = customerRepository.findById(request.customerId())
                    .orElseThrow();
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

            Product product = productRepository.findById(itemRequest.productId())
                    .orElseThrow();

            int quantity = itemRequest.quantity();

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

            // descontar stock
            ProductStock stock = productStockRepository
                    .findByProductAndBranch(product, branch)
                    .orElseThrow();

            stock.setQuantity(stock.getQuantity() - quantity);
        }

        sale.setItems(items);
        sale.setTotalAmount(totalAmount);
        sale.setTotalCost(totalCost);
        sale.setProfit(totalAmount.subtract(totalCost));
        sale.setTotalItems(totalItems);
        sale.setStatus(SaleStatus.COMPLETED);

        Sale savedSale = repository.save(sale);

        // actualizar deuda si es fiado
        if (customer != null) {
            customer.setCurrentDebt(
                    customer.getCurrentDebt().add(totalAmount)
            );
        }

        return savedSale;
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
                .orElseThrow(() -> new BusinessException("Sale not found with id: " + id));
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