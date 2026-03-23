package com.backend.app.venta.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory; // 🚀 Importaciones de SLF4J
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.app.cliente.model.Customer;
import com.backend.app.cliente.repository.CustomerRepository;
import com.backend.app.exception.BusinessException;
import com.backend.app.exception.InsufficientStockException;
import com.backend.app.exception.ResourceNotFoundException;
import com.backend.app.finanza.model.FiscalReceipt;
import com.backend.app.finanza.model.FiscalReceiptTax;
import com.backend.app.finanza.model.ReceiptType;
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
@Transactional
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
    
    public Sale createSale(CreateSaleRequest request) {
        log.info("🚀 Iniciando creación de venta. Sucursal ID: {}, Canal: {}", request.branchId(), request.channel());
    
        // Validaciones y búsqueda de sucursal/cliente (igual que antes)
        if (request.items() == null || request.items().isEmpty()) {
            throw new BusinessException("No se puede registrar una venta sin productos");
        }
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
    
        // Procesar ítems y stock (igual que antes)
        for (CreateSaleItemRequest itemRequest : request.items()) {
            Product product = productRepository.findById(itemRequest.productId())
                    .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + itemRequest.productId()));
    
            int quantity = itemRequest.quantity();
            if (quantity <= 0) throw new BusinessException("Cantidad inválida para producto " + product.getName());
    
            ProductStock stock = productStockRepository.findByProductAndBranch(product, branch)
                    .orElseThrow(() -> new BusinessException("El producto " + product.getName() + " no tiene stock en esta sucursal"));
            if (stock.getQuantity() < quantity) throw new InsufficientStockException(product.getName(), quantity, stock.getQuantity());
    
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
    
            stock.setQuantity(stock.getQuantity() - quantity); // descontar stock
        }
    
        sale.setItems(items);
        sale.setTotalAmount(totalAmount);
        sale.setTotalCost(totalCost);
        sale.setProfit(totalAmount.subtract(totalCost));
        sale.setTotalItems(totalItems);
        sale.setStatus(SaleStatus.COMPLETED);
    
        if (customer != null) {
            BigDecimal oldDebt = customer.getCurrentDebt() != null ? customer.getCurrentDebt() : BigDecimal.ZERO;
            customer.setCurrentDebt(oldDebt.add(totalAmount));
        }

        FiscalReceipt receipt = buildFiscalReceipt(sale, items, customer);
        sale.setFiscalReceipt(receipt);

    
        Sale savedSale = repository.save(sale);
        log.info("Venta ID: {} completada con factura fiscal generada. Total: ${}, Items: {}", savedSale.getId(), totalAmount, totalItems);
    
        return savedSale;
    }

    private FiscalReceipt buildFiscalReceipt(Sale sale, List<SaleItem> items, Customer customer) {
        // 🚀 Crear FiscalReceipt automáticamente
        FiscalReceipt receipt = new FiscalReceipt();
        receipt.setSale(sale);
        receipt.setType(ReceiptType.FACTURA_B); // ajustar según cliente y condiciones
        receipt.setPointOfSale(1); // ajustar según sucursal
        receipt.setReceiptNumberFrom(generateReceiptNumber()); // correlativo
        receipt.setReceiptNumberTo(receipt.getReceiptNumberFrom());
        receipt.setIssueDate(LocalDate.now());
        receipt.setConcept(1);
    
        if (customer != null) {
            /* receipt.setCustomerCuit(customer.getCuit()); */
            receipt.setCustomerName(customer.getName());
            /* receipt.setCustomerDocType(customer.getDocType()); */
        }
    
        // Desglose de impuestos (IVA 21% como ejemplo)
        Map<Integer, BigDecimal> netByRate = new HashMap<>();

        for (SaleItem item : items) {
            int rate = 21; // futuro: desde Product
        
            boolean discriminatesVat = receipt.getType().discriminatesVat();

            BigDecimal divisor = BigDecimal.ONE.add(
                BigDecimal.valueOf(rate).divide(BigDecimal.valueOf(100))
            );
            
            BigDecimal net = discriminatesVat
                ? item.getSubtotal()
                : item.getSubtotal().divide(divisor, 2, RoundingMode.HALF_UP);

            netByRate.merge(rate, net, BigDecimal::add);
        }
        
        List<FiscalReceiptTax> taxes = new ArrayList<>();
        
        for (Map.Entry<Integer, BigDecimal> entry : netByRate.entrySet()) {
            Integer rate = entry.getKey();
            BigDecimal net = entry.getValue();
        
            FiscalReceiptTax tax = new FiscalReceiptTax();
            tax.setFiscalReceipt(receipt);
            tax.setNetAmount(net);
            tax.setAlicuota(rate);
            tax.setTaxAmount(net.multiply(BigDecimal.valueOf(rate).divide(BigDecimal.valueOf(100))));
        
            taxes.add(tax);
        }
        receipt.setTaxes(taxes);
    
        return receipt;
    }

    private Long generateReceiptNumber() {
        // 🔹 Obtener el último número de factura en la base de datos
        Long lastNumber = repository.findTopByOrderByIdDesc()
                .map(sale -> sale.getFiscalReceipt() != null ? sale.getFiscalReceipt().getReceiptNumberFrom() : 0L)
                .orElse(0L);
    
        // 🔹 Incrementar para el siguiente comprobante
        return lastNumber + 1;
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