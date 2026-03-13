package com.backend.app.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;

import com.backend.app.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.backend.app.model.Customer;
import com.backend.app.model.Sale;
import com.backend.app.model.User;
import com.backend.app.model.dto.CreateCustomerRequest;
import com.backend.app.model.dto.CustomerListResponse;
import com.backend.app.model.dto.CustomerSaleResponse;
import com.backend.app.repository.CustomerRepository;
import com.backend.app.repository.SaleRepository;
import com.backend.app.repository.UserRepository;

@Service
public class CustomerService {
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
        Customer customer = repository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con ID: " + customerId));

        customer.setTags(newTags);
        repository.save(customer);
    }

    public Page<CustomerListResponse> getCustomers(Long userId, int page, int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
    
        return repository.findByUserId(userId, pageable)
                .map(c -> {
                    if (c.getCurrentDebt() != null &&
                        c.getCreditLimit() != null &&
                        c.getCurrentDebt().compareTo(c.getCreditLimit().multiply(BigDecimal.valueOf(0.8))) > 0) {
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
        Page<Sale> sales = saleRepository.findByCustomer_Id(customerId, PageRequest.of(page, size));
        return sales.map(s -> new CustomerSaleResponse(
            s.getId(),
            s.getTotalAmount(),
            s.getTotalItems(),
            s.getStatus(),
            s.getCreatedAt()
        ));
    }

    public Long createCustomer(CreateCustomerRequest request, Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));

        Optional<Customer> existing = repository.findByPhoneAndUserId(request.phone(), id);

        if (existing.isPresent()) {
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
    
        return repository.save(customer).getId();
    }
}
