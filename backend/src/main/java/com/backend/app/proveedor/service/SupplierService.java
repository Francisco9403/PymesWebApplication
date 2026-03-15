package com.backend.app.proveedor.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory; // 🚀 Importaciones de SLF4J
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

    // 🚀 Definición del Logger para el proceso de Importación
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

    public List<Supplier> getAllSuppliers() {
        log.debug("Recuperando lista completa de proveedores.");
        return repository.findAll();
    }

    public Supplier getSupplierById(Long id) {
        log.debug("Buscando proveedor por ID: {}", id);
        return repository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Consulta fallida: Proveedor ID {} no existe", id);
                    return new ResourceNotFoundException("Proveedor no encontrado con ID: " + id);
                });
    }

    public void importFromOCR(SupplierImportDTO dto, Long userId) {
        log.info("🚀 Iniciando proceso de importación OCR para el usuario ID: {}", userId);
        log.info("Datos recibidos: Proveedor '{}', CUIT '{}', Total productos: {}",
                dto.businessName(), dto.cuit(), dto.products().size());

        // 1. Upsert del Proveedor
        Supplier supplier = repository.findByCuit(dto.cuit())
                .map(existing -> {
                    log.info("Proveedor existente encontrado (CUIT: {}). Actualizando razón social y categoría.", dto.cuit());
                    existing.setBusinessName(dto.businessName());
                    existing.setTaxCategory(dto.taxCategory());
                    return repository.save(existing);
                })
                .orElseGet(() -> {
                    log.info("Nuevo proveedor detectado. Registrando '{}' con CUIT: {}", dto.businessName(), dto.cuit());
                    Supplier newSupplier = new Supplier();
                    newSupplier.setCuit(dto.cuit());
                    newSupplier.setBusinessName(dto.businessName());
                    newSupplier.setTaxCategory(dto.taxCategory());

                    newSupplier = repository.save(newSupplier);

                    log.debug("Creando cuenta corriente para el nuevo proveedor ID: {}", newSupplier.getId());
                    CurrentAccount account = new CurrentAccount();
                    account.setBalance(BigDecimal.ZERO);
                    account.setCreditLimit(BigDecimal.ZERO);
                    account.setOwnerId(newSupplier.getId());

                    newSupplier.setCurrentAccount(account);
                    return repository.save(newSupplier);
                });

        // 2. Procesar Productos
        int processedCount = 0;
        for (ProductImportDTO pDto : dto.products()) {
            log.debug("Procesando producto de la lista OCR: {}", pDto.name());

            Product product = findOrCreateProduct(pDto, userId);

            log.debug("Actualizando precios para '{}'. Costo: {}", product.getName(), pDto.baseCostPrice());
            product.setBaseCostPrice(pDto.baseCostPrice());
            product.setCurrentSalePrice(
                    pDto.baseCostPrice().multiply(new BigDecimal("1.3"))
            );

            if (!product.getSuppliers().contains(supplier)) {
                log.debug("Vinculando proveedor '{}' al producto '{}'", supplier.getBusinessName(), product.getName());
                product.getSuppliers().add(supplier);
            }

            if (!supplier.getProducts().contains(product)) {
                supplier.getProducts().add(product);
            }

            updateProductStock(product, dto.branchId(), pDto.quantity());

            if (product.getAiDescriptions() == null || product.getAiDescriptions().isEmpty()) {
                log.info("Producto nuevo o sin descripciones. Generando contenido IA para: {}", product.getName());
                generateAIDescriptions(product);
            }

            productRepository.save(product);
            processedCount++;
        }

        log.info("Importación finalizada con éxito. Se procesaron {} productos para el proveedor '{}'",
                processedCount, supplier.getBusinessName());
    }


    private Product findOrCreateProduct(ProductImportDTO pDto, Long userId) {
        // 1. Buscamos primero por EAN
        if (pDto.ean13() != null && !pDto.ean13().isBlank()) {
            Optional<Product> byEan = productRepository.findByEan13(pDto.ean13());
            if (byEan.isPresent() && byEan.get().getUser().getId().equals(userId)) {
                log.debug("Producto encontrado por EAN: {} ({})", pDto.ean13(), byEan.get().getName());
                return byEan.get();
            }
        }

        // 2. Buscamos por nombre
        Optional<Product> byName = productRepository.findByNameAndUserId(pDto.name(), userId);
        if (byName.isPresent()) {
            log.debug("Producto encontrado por nombre: {}", pDto.name());
            return byName.get();
        }

        // 3. Si no existe, creamos uno nuevo
        log.info("Producto '{}' no existe en el catálogo de Junín. Creando nuevo registro.", pDto.name());
        Product newP = new Product();
        newP.setName(pDto.name());
        newP.setEan13(pDto.ean13());
        newP.setSku(generateSku(pDto));
        newP.setStocks(new ArrayList<>());

        User user = new User();
        user.setId(userId);
        newP.setUser(user);

        log.debug("Nuevo producto instanciado con SKU: {}", newP.getSku());
        return newP;
    }

    private void updateProductStock(Product product, Long branchId, Integer addedQuantity) {
        log.debug("Actualizando stock para '{}' en sucursal ID: {}. Cantidad a sumar: {}",
                product.getName(), branchId, addedQuantity);

        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> {
                    log.error("Error crítico de stock: La sucursal {} no existe.", branchId);
                    return new ResourceNotFoundException("La sucursal con ID " + branchId + " no existe en el sistema");
                });

        ProductStock stock = product.getStocks().stream()
                .filter(s -> s.getBranch() != null && s.getBranch().getId().equals(branchId))
                .findFirst()
                .orElseGet(() -> {
                    log.info("Creando nuevo registro de stock para '{}' en sucursal '{}'", product.getName(), branch.getName());
                    ProductStock newStock = new ProductStock();
                    newStock.setProduct(product);
                    newStock.setBranch(branch);
                    product.getStocks().add(newStock);
                    return newStock;
                });

        int currentQty = stock.getQuantity() != null ? stock.getQuantity() : 0;
        stock.setQuantity(currentQty + addedQuantity);
        log.debug("Stock final para '{}' en sucursal '{}': {}", product.getName(), branch.getName(), stock.getQuantity());
    }

    private void generateAIDescriptions(Product product) {
        for (CommunicationChannel channel : CommunicationChannel.values()) {
            log.debug("Solicitando descripción IA para '{}' - Canal: {}", product.getName(), channel);
            String content = aiService.generateDescription(product.getName(), channel);

            AIProductDescription desc = new AIProductDescription();
            desc.setChannel(channel);
            desc.setGeneratedContent(content);
            desc.setProduct(product);
            product.getAiDescriptions().add(desc);
        }
        log.info("Descripciones automáticas generadas para el producto: {}", product.getName());
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
        String finalSku = base + "-" + String.format("%04d", count + 1);

        log.debug("SKU autogenerado: {}", finalSku);
        return finalSku;
    }
}