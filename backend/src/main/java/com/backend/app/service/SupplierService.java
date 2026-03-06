package com.backend.app.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.app.model.AIProductDescription;
import com.backend.app.model.CommunicationChannel;
import com.backend.app.model.Product;
import com.backend.app.model.ProductStock;
import com.backend.app.model.Supplier;
import com.backend.app.model.dto.ProductImportDTO;
import com.backend.app.model.dto.SupplierImportDTO;
import com.backend.app.repository.ProductRepository;
import com.backend.app.repository.SupplierRepository;
import com.backend.app.exception.BusinessException;

@Service
@Transactional
public class SupplierService {

    private final SupplierRepository repository;
    private final ProductRepository productRepository;
    private final AIService aiService;

    public SupplierService(SupplierRepository repository, ProductRepository productRepository, AIService aiService) {
        this.repository = repository;
        this.productRepository = productRepository;
        this.aiService = aiService;
    }

    public Supplier createSupplier(Supplier supplier) {
        return repository.save(supplier);
    }

    public List<Supplier> getAllSuppliers() {
        return repository.findAll();
    }

    public Supplier getSupplierById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new BusinessException("Supplier not found with id: " + id));
    }


    public void importFromOCR(SupplierImportDTO dto) {
        // 1. Upsert del Proveedor (Actualizando si ya existe)
        Supplier supplier = repository.findByCuit(dto.cuit())
            .map(existing -> {
                existing.setBusinessName(dto.businessName());
                existing.setTaxCategory(dto.taxCategory());
                return repository.save(existing);
            })
            .orElseGet(() -> {
                Supplier newSupplier = new Supplier();
                newSupplier.setCuit(dto.cuit());
                newSupplier.setBusinessName(dto.businessName());
                newSupplier.setTaxCategory(dto.taxCategory());
                return repository.save(newSupplier);
            });
    
        // 2. Procesar Productos
        for (ProductImportDTO pDto : dto.products()) {
            Product product = productRepository.findByName(pDto.name()) 
                .orElseGet(() -> {
                    Product newP = new Product();
                    newP.setName(pDto.name());
                    newP.setStocks(new ArrayList<>()); // Inicializar listas para evitar NullPointer
                    return newP;
                });
    
            product.setBaseCostPrice(pDto.baseCostPrice());
            product.setCurrentSalePrice(pDto.baseCostPrice().multiply(new BigDecimal("1.3")));
    
            // 3. ASOCIAR PRODUCTO CON PROVEEDOR (Bidireccional)
            if (!product.getSuppliers().contains(supplier)) {
                product.getSuppliers().add(supplier);
            }
            if (!supplier.getProducts().contains(product)) {
                supplier.getProducts().add(product);
            }
    
            // 4. Actualizar Stock
            updateProductStock(product, dto.branchId(), pDto.quantity());
    
            // 5. Generar descripciones
            if (product.getAiDescriptions() == null || product.getAiDescriptions().isEmpty()) {
                generateAIDescriptions(product);
            }
    
            // Guardar el producto (esto persistirá la relación en product_supplier)
            productRepository.save(product);
        }
    }
    
    private void updateProductStock(Product product, Long branchId, Integer addedQuantity) {
        // IMPORTANTE: Debes buscar la entidad Branch real
        // Branch branch = branchRepository.findById(branchId).orElseThrow(); 
        
        ProductStock stock = product.getStocks().stream()
            .filter(s -> s.getBranch() != null && s.getBranch().getId().equals(branchId))
            .findFirst()
            .orElseGet(() -> {
                ProductStock newStock = new ProductStock();
                newStock.setProduct(product);
                // newStock.setBranch(branch); // <--- DEBES SETEAR LA ENTIDAD RAMA AQUÍ
                product.getStocks().add(newStock);
                return newStock;
            });
    
        int currentQty = (stock.getQuantity() != null) ? stock.getQuantity() : 0;
        stock.setQuantity(currentQty + addedQuantity);
    }

    private void generateAIDescriptions(Product product) {
        for (CommunicationChannel channel : CommunicationChannel.values()) {
            // Usamos product.getName() en lugar de SKU
            String content = aiService.generateDescription(product.getName(), channel);
            AIProductDescription desc = new AIProductDescription();
            desc.setChannel(channel);
            desc.setGeneratedContent(content);
            desc.setProduct(product);
            product.getAiDescriptions().add(desc);
        }
    }
}