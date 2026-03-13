package com.backend.app.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.backend.app.exception.ResourceNotFoundException;
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
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor no encontrado con ID: " + id));
    }

    public void importFromOCR(SupplierImportDTO dto, Long userId) {
        // Limpiamos to do lo que no sea número o letra para que sea consistente
        String cleanCuit = dto.cuit().replaceAll("[^a-zA-Z0-9]", "");

        if (cleanCuit.isEmpty()) {
            throw new BusinessException("El CUIT detectado está vacío o es inválido");
        }

        // 1. Upsert del Proveedor
        Supplier supplier = repository.findByCuit(cleanCuit)
                .map(existing -> {
                    existing.setBusinessName(dto.businessName());
                    existing.setPaymentMethod(dto.taxCategory());
                    return repository.save(existing);
                })
                .orElseGet(() -> {
                    Supplier newSupplier = new Supplier();
                    newSupplier.setCuit(cleanCuit);
                    newSupplier.setBusinessName(dto.businessName());
                    newSupplier.setPaymentMethod(dto.taxCategory());
                    return repository.save(newSupplier);
                });

        // 2. Procesar Productos
        for (ProductImportDTO pDto : dto.products()) {
            // Validamos que el precio no sea cero o negativo
            if (pDto.baseCostPrice().compareTo(BigDecimal.ZERO) <= 0) {
                continue; // O podrías lanzar BusinessException si quieres frenar to do
            }

            Product product = findOrCreateProduct(pDto, userId);

            product.setBaseCostPrice(pDto.baseCostPrice());
            product.setCurrentSalePrice(
                    pDto.baseCostPrice().multiply(new BigDecimal("1.3"))
            );

            // Sincronización de la relación Many-to-Many
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