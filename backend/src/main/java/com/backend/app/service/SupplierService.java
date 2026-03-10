package com.backend.app.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.app.model.AIProductDescription;
import com.backend.app.model.Branch;
import com.backend.app.model.CommunicationChannel;
import com.backend.app.model.Product;
import com.backend.app.model.ProductStock;
import com.backend.app.model.Supplier;
import com.backend.app.model.User;
import com.backend.app.model.dto.ProductImportDTO;
import com.backend.app.model.dto.SupplierImportDTO;
import com.backend.app.repository.BranchRepository;
import com.backend.app.repository.ProductRepository;
import com.backend.app.repository.SupplierRepository;
import com.backend.app.exception.BusinessException;

@Service
@Transactional
public class SupplierService {

    private final SupplierRepository repository;
    private final ProductRepository productRepository;
    private final BranchRepository branchRepository;
    private final AIService aiService;

    public SupplierService(SupplierRepository repository, ProductRepository productRepository,
            BranchRepository branchRepository, AIService aiService) {
        this.repository = repository;
        this.productRepository = productRepository;
        this.branchRepository = branchRepository;
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

    public void importFromOCR(SupplierImportDTO dto, Long id) {
        // 1. Upsert del Proveedor (Actualizando si ya existe)
        Supplier supplier = repository.findByCuit(dto.cuit())
            .map(existing -> {
                existing.setBusinessName(dto.businessName());
                existing.setPaymentMethod(dto.paymentMethod());
                return repository.save(existing);
            })
            .orElseGet(() -> {
                Supplier newSupplier = new Supplier();
                newSupplier.setCuit(dto.cuit());
                newSupplier.setBusinessName(dto.businessName());
                newSupplier.setPaymentMethod(dto.paymentMethod());
                return repository.save(newSupplier);
            });
    
        // 2. Procesar Productos
        for (ProductImportDTO pDto : dto.products()) {

            Product product = findOrCreateProduct(pDto, id);
        
            product.setBaseCostPrice(pDto.baseCostPrice());
            product.setCurrentSalePrice(
                pDto.baseCostPrice().multiply(new BigDecimal("1.3"))
            );
        
            if (!product.getSuppliers().contains(supplier)) {
                product.getSuppliers().add(supplier);
            }
        
            if (!supplier.getProducts().contains(product)) {
                supplier.getProducts().add(product);
            }
        
            updateProductStock(product, dto.branchId(), pDto.quantity());
        
            if (product.getAiDescriptions() == null || product.getAiDescriptions().isEmpty()) {
                generateAIDescriptions(product);
            }
        
            productRepository.save(product);
        }
    }

    private Product findOrCreateProduct(ProductImportDTO pDto, Long userId) {
        // buscar por EAN o nombre como antes
        Optional<Product> byEan = Optional.empty();
        if (pDto.ean13() != null && !pDto.ean13().isBlank()) {
            byEan = productRepository.findByEan13(pDto.ean13());
            if (byEan.isPresent()) return byEan.get();
        }
    
        Optional<Product> byName = productRepository.findByName(pDto.name());
        if (byName.isPresent()) return byName.get();
    
        // Crear producto nuevo
        Product newP = new Product();
        newP.setName(pDto.name());
        newP.setEan13(pDto.ean13());
        newP.setStocks(new ArrayList<>());
    
        User user = new User();
        user.setId(userId); // ⚠ solo setId para evitar fetch si no quieres cargarlo
        newP.setUser(user);
    
        return newP;
    }
    
    private void updateProductStock(Product product, Long branchId, Integer addedQuantity) {

        Branch branch = branchRepository.findById(branchId)
            .orElseThrow(() -> new RuntimeException("Branch not found"));
    
        ProductStock stock = product.getStocks().stream()
            .filter(s -> s.getBranch() != null && s.getBranch().getId().equals(branchId))
            .findFirst()
            .orElseGet(() -> {
                ProductStock newStock = new ProductStock();
                newStock.setProduct(product);
                newStock.setBranch(branch);
                product.getStocks().add(newStock);
                return newStock;
            });
    
        int currentQty = stock.getQuantity() != null ? stock.getQuantity() : 0;
        stock.setQuantity(currentQty + addedQuantity);
    }

    private void generateAIDescriptions(Product product) {
        for (CommunicationChannel channel : CommunicationChannel.values()) {
            String content = aiService.generateDescription(product.getName(), channel);
            AIProductDescription desc = new AIProductDescription();
            desc.setChannel(channel);
            desc.setGeneratedContent(content);
            desc.setProduct(product);
            product.getAiDescriptions().add(desc);
        }
    }
}

// Validaciones actuales antes de crear o actualizar:
// validar proveedor por CUIT
// validar producto por ean13 (preferente), sino por nombre
// validar stock del producto por sucursal