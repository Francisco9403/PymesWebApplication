package com.backend.app.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.backend.app.model.SaleItem;
import com.backend.app.repository.SaleItemRepository;
import com.backend.app.exception.ResourceNotFoundException; // 🚀 Cambio clave

@Service
public class SaleItemService {

    private final SaleItemRepository saleItemRepository;

    public SaleItemService(SaleItemRepository saleItemRepository) {
        this.saleItemRepository = saleItemRepository;
    }

    public SaleItem getSaleItemById(Long id) {
        return saleItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item de venta no encontrado con ID: " + id));
    }

    public List<SaleItem> getHistoryByProduct(Long productId) {
        return saleItemRepository.findByProductId(productId);
    }
}