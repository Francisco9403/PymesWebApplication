package com.backend.app.cliente.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory; // 🚀 Importaciones de SLF4J
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.backend.app.cliente.model.Customer;
import com.backend.app.cliente.model.dto.CreateCustomerRequest;
import com.backend.app.cliente.model.dto.CustomerListResponse;
import com.backend.app.cliente.model.dto.CustomerSaleResponse;
import com.backend.app.cliente.repository.CustomerRepository;
import com.backend.app.exception.ResourceNotFoundException;
import com.backend.app.usuario.model.User;
import com.backend.app.usuario.repository.UserRepository;
import com.backend.app.venta.model.Sale;
import com.backend.app.venta.repository.SaleRepository;

@Service
public class CustomerService {

    // 🚀 Definición del Logger para auditar la gestión de clientes
    private static final Logger log = LoggerFactory.getLogger(CustomerService.class);

    private final CustomerRepository repository;
    private final UserRepository userRepository;
    private final SaleRepository saleRepository;

    public CustomerService(CustomerRepository repository, UserRepository userRepository,
                           SaleRepository saleRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
        this.saleRepository = saleRepository;
    }

    public void updateCustomerTags(Long customerId, Set<String> newTags) {
        log.info("Actualizando etiquetas para el cliente ID: {}. Nuevas etiquetas: {}", customerId, newTags);

        Customer customer = repository.findById(customerId)
                .orElseThrow(() -> {
                    log.warn("Fallo al actualizar etiquetas: Cliente ID {} no encontrado", customerId);
                    return new ResourceNotFoundException("Cliente no encontrado con ID: " + customerId);
                });

        customer.setTags(newTags);
        repository.save(customer);
        log.info("Etiquetas actualizadas con éxito para el cliente: {}", customer.getName());
    }

    public Page<CustomerListResponse> getCustomers(Long userId, int page, int size) {
        log.debug("Solicitando página {} de clientes para el usuario ID: {}", page, userId);

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        return repository.findByUserId(userId, pageable)
                .map(c -> {
                    // Lógica de monitoreo de riesgo crediticio
                    if (c.getCurrentDebt() != null &&
                            c.getCreditLimit() != null &&
                            c.getCurrentDebt().compareTo(c.getCreditLimit().multiply(BigDecimal.valueOf(0.8))) > 0) {
                        log.warn("⚠️ Riesgo Crediticio: El cliente '{}' (ID: {}) ha superado el 80% de su límite.",
                                c.getName(), c.getId());
                    }

                    return new CustomerListResponse(
                            c.getId(),
                            c.getName(),
                            c.getPhone(),
                            c.getCurrentDebt(),
                            c.getCreditLimit(),
                            c.getTags(),
                            null
                    );
                });
    }

    public Page<CustomerSaleResponse> getSalesByCustomer(Long customerId, int page, int size) {
        log.debug("Consultando historial de ventas para el cliente ID: {}. Página: {}", customerId, page);

        Page<Sale> sales = saleRepository.findByCustomer_Id(customerId, PageRequest.of(page, size));

        log.info("Se recuperaron {} ventas para el cliente ID: {}", sales.getNumberOfElements(), customerId);
        return sales.map(s -> new CustomerSaleResponse(
                s.getId(),
                s.getTotalAmount(),
                s.getTotalItems(),
                s.getStatus(),
                s.getCreatedAt()
        ));
    }

    public Long createCustomer(CreateCustomerRequest request, Long id) {
        log.info("Iniciando registro de nuevo cliente: '{}' (Tel: {}) para el usuario ID: {}",
                request.name(), request.phone(), id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Error crítico: El usuario ID {} intentó crear un cliente pero no existe en el sistema", id);
                    return new ResourceNotFoundException("Usuario no encontrado con ID: " + id);
                });

        Optional<Customer> existing = repository.findByPhoneAndUserId(request.phone(), id);

        if (existing.isPresent()) {
            log.info("Cliente ya existente con el teléfono {}. Retornando ID: {}", request.phone(), existing.get().getId());
            return existing.get().getId(); // Evita duplicados por teléfono
        }

        Customer customer = new Customer();
        customer.setName(request.name());
        customer.setPhone(request.phone());
        customer.setEmail(request.email());
        customer.setAddress(request.address());
        customer.setCreditLimit(
                request.creditLimit() != null ? request.creditLimit() : BigDecimal.ZERO
        );
        customer.setCurrentDebt(BigDecimal.ZERO);
        customer.setUser(user);
        customer.setCreatedAt(LocalDateTime.now());

        Customer savedCustomer = repository.save(customer);
        log.info(" Cliente '{}' creado exitosamente con ID: {}", savedCustomer.getName(), savedCustomer.getId());

        return savedCustomer.getId();
    }
}