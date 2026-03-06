package com.backend.app.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.backend.app.model.Sale;
import com.backend.app.model.SaleStatus;
import com.backend.app.repository.SaleRepository;
import com.backend.app.exception.BusinessException;

@Service
public class SaleService {

    private final SaleRepository saleRepository;

    public SaleService(SaleRepository saleRepository) {
        this.saleRepository = saleRepository;
    }

    public Sale createSale(Sale sale) {
        // Inicializamos datos básicos de la venta
        sale.setCreatedAt(LocalDateTime.now());
        sale.setStatus(SaleStatus.PENDING_PAYMENT); // Arranca pendiente hasta que paguen

        // Futuro: Acá deberíamos recorrer sale.getItems() y llamar a ProductStockService
        // para descontar el inventario de la sucursal (branch).

        return saleRepository.save(sale);
    }

    public List<Sale> getSalesByBranch(Long branchId) {
        return saleRepository.findByBranchId(branchId);
    }

    public Sale getSaleById(Long id) {
        return saleRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Sale not found with id: " + id));
    }
}