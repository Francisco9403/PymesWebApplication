package com.backend.app.proveedor.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.backend.app.cuentaCorriente.model.CurrentAccount;
import com.backend.app.exception.ResourceNotFoundException;
import com.backend.app.archivosParaRevisar.*;
import com.backend.app.producto.model.AIProductDescription;
import com.backend.app.producto.model.Product;
import com.backend.app.producto.model.ProductStock;
import com.backend.app.proveedor.model.Supplier;
import com.backend.app.sucursal.model.Branch;
import com.backend.app.usuario.model.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.app.producto.model.dto.ProductImportDTO;
import com.backend.app.proveedor.model.dto.SupplierImportDTO;
import com.backend.app.sucursal.respository.BranchRepository;
import com.backend.app.producto.repository.ProductRepository;
import com.backend.app.proveedor.repository.SupplierRepository;

@Service
@Transactional
public class SupplierService {

    private static final Logger log = LoggerFactory.getLogger(SupplierService.class);

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
        log.info("Creando proveedor manualmente: {} (CUIT: {})", supplier.getBusinessName(), supplier.getCuit());
        return repository.save(supplier);
    }

    // 🚀 ACTUALIZADO: Soporta filtrado por sucursal para cumplir el ticket
    public List<Supplier> getSuppliersByBranch(Long branchId) {
        log.debug("Recuperando proveedores. Filtro sucursal: {}", branchId);
        if (branchId != null) {
            // Buscamos proveedores que tengan productos con stock en esa sucursal
            return repository.findByBranchId(branchId);
        }
        return repository.findAll();
    }

    public Supplier getSupplierById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor no encontrado con ID: " + id));
    }

    public void importFromOCR(SupplierImportDTO dto, Long userId) {
        log.info("🚀 Iniciando importación OCR. Usuario: {}, Sucursal: {}", userId, dto.branchId());

        // 1. Upsert del Proveedor
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

        // 2. Procesar Productos e Impactar Stock en la Sucursal elegida
        for (ProductImportDTO pDto : dto.products()) {
            Product product = findOrCreateProduct(pDto, userId);

            product.setBaseCostPrice(pDto.baseCostPrice());
            product.setCurrentSalePrice(pDto.baseCostPrice().multiply(new BigDecimal("1.3")));

            if (!product.getSuppliers().contains(supplier)) {
                product.getSuppliers().add(supplier);
            }

            if (!supplier.getProducts().contains(product)) {
                supplier.getProducts().add(product);
            }

            // Impactamos el stock específicamente en la sucursal del DTO
            updateProductStock(product, dto.branchId(), pDto.quantity());

            if (product.getAiDescriptions() == null || product.getAiDescriptions().isEmpty()) {
                generateAIDescriptions(product);
            }

            productRepository.save(product);
        }
        log.info("Importación finalizada para '{}'", supplier.getBusinessName());
    }

    private Product findOrCreateProduct(ProductImportDTO pDto, Long userId) {
        if (pDto.ean13() != null && !pDto.ean13().isBlank()) {
            Optional<Product> byEan = productRepository.findByEan13(pDto.ean13());
            if (byEan.isPresent() && byEan.get().getUser().getId().equals(userId)) {
                return byEan.get();
            }
        }

        return productRepository.findByNameAndUserId(pDto.name(), userId)
                .orElseGet(() -> {
                    Product newP = new Product();
                    newP.setName(pDto.name());
                    newP.setEan13(pDto.ean13());
                    newP.setSku(generateSku(pDto));
                    newP.setStocks(new ArrayList<>());

                    User user = new User();
                    user.setId(userId);
                    newP.setUser(user);
                    return newP;
                });
    }

    private void updateProductStock(Product product, Long branchId, Integer addedQuantity) {
        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new ResourceNotFoundException("La sucursal ID " + branchId + " no existe"));

        ProductStock stock = product.getStocks().stream()
                .filter(s -> s.getBranch() != null && s.getBranch().getId().equals(branchId))
                .findFirst()
                .orElseGet(() -> {
                    ProductStock newStock = new ProductStock();
                    newStock.setProduct(product);
                    newStock.setBranch(branch);
                    newStock.setQuantity(0); // Inicializamos en 0
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
        if (dto.ean13() != null && !dto.ean13().isBlank()) return dto.ean13();

        String base = dto.name().toUpperCase().replaceAll("[^A-Z0-9 ]", "").trim().replaceAll("\\s+", "-");
        if (base.length() > 15) base = base.substring(0, 15);

        long count = productRepository.countBySkuStartingWith(base);
        return base + "-" + String.format("%04d", count + 1);
    }
}