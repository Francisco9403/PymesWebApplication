package com.backend.app.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.backend.app.exception.ResourceNotFoundException;
import com.backend.app.model.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.app.model.dto.ProductImportDTO;
import com.backend.app.model.dto.SupplierImportDTO;
import com.backend.app.repository.BranchRepository;
import com.backend.app.repository.ProductRepository;
import com.backend.app.repository.SupplierRepository;

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
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor no encontrado con ID: " + id));
    }

    public void importFromOCR(SupplierImportDTO dto, Long id) {
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
                    
                    newSupplier = repository.save(newSupplier);
                    
                    CurrentAccount account = new CurrentAccount();
                    account.setBalance(BigDecimal.ZERO);
                    account.setCreditLimit(BigDecimal.ZERO);
                    account.setOwnerId(newSupplier.getId());
                    
                    newSupplier.setCurrentAccount(account);
                    
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
        // 1. Buscamos primero por EAN (siempre filtrando por el usuario logueado)
        if (pDto.ean13() != null && !pDto.ean13().isBlank()) {
            Optional<Product> byEan = productRepository.findByEan13(pDto.ean13());
            // Nota: Si el EAN es global, verificamos que pertenezca al usuario
            if (byEan.isPresent() && byEan.get().getUser().getId().equals(userId)) {
                return byEan.get();
            }
        }

        // 2. Buscamos por nombre pero SOLO los productos de este usuario
        Optional<Product> byName = productRepository.findByNameAndUserId(pDto.name(), userId);
        if (byName.isPresent()) return byName.get();

        // 3. Si no existe, creamos uno nuevo vinculado al usuario
        Product newP = new Product();
        newP.setName(pDto.name());
        newP.setEan13(pDto.ean13());
        newP.setSku(generateSku(pDto));
        newP.setStocks(new ArrayList<>());

        User user = new User();
        user.setId(userId);
        newP.setUser(user);

        return newP;
    }

    private void updateProductStock(Product product, Long branchId, Integer addedQuantity) {
        // 🚀 CAMBIO: Usamos ResourceNotFoundException en lugar de RuntimeException
        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new ResourceNotFoundException("La sucursal con ID " + branchId + " no existe en el sistema"));

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

    private String generateSku(ProductImportDTO dto) {

        if (dto.ean13() != null && !dto.ean13().isBlank())
            return dto.ean13();

        String base = dto.name()
            .toUpperCase()
            .replaceAll("[^A-Z0-9 ]", "")
            .trim()
            .replaceAll("\\s+", "-");

        if (base.length() > 15)
            base = base.substring(0, 15);

        long count = productRepository.countBySkuStartingWith(base);

        return base + "-" + String.format("%04d", count + 1);
    }
}

// Validaciones actuales antes de crear o actualizar:
// validar proveedor por CUIT
// validar producto por ean13 (preferente), sino por nombre
// validar stock del producto por sucursal