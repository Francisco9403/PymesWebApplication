package com.backend.app.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.List;
import org.springframework.stereotype.Service;
import com.backend.app.model.Sale;
import com.backend.app.repository.SaleRepository;
import com.backend.app.exception.BusinessException;

@Service
public class SaleService {

    private final SaleRepository saleRepository;

    public SaleService(SaleRepository saleRepository) {
        this.saleRepository = saleRepository;
    }

    // Nuevo método para el reporte de Finanzas
    public List<Sale> getSalesByMonth(int month, int year) {
        // Calculamos el inicio y fin del mes
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDateTime start = yearMonth.atDay(1).atStartOfDay();
        LocalDateTime end = yearMonth.atEndOfMonth().atTime(LocalTime.MAX);

        return saleRepository.findByCreatedAtBetweenAndFiscalReceiptIsNotNull(start, end);
    }

    public Sale createSale(Sale sale) {
        sale.setCreatedAt(LocalDateTime.now());
        // Por defecto, si hay FiscalReceipt, quizás ya debería estar COMPLETED
        return saleRepository.save(sale);
    }

    public List<Sale> getSalesByBranch(Long branchId) {
        return saleRepository.findByBranchId(branchId);
    }

    public Sale getSaleById(Long id) {
        return saleRepository.findById(id)
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




