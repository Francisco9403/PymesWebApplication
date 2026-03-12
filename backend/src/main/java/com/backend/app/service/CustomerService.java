package com.backend.app.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

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

    public Page<CustomerListResponse> getCustomers(Long userId, int page, int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
    
        return repository.findByUserId(userId, pageable)
                .map(c -> {
    
                    String tag = null;
    
                    if (c.getCurrentDebt() != null &&
                        c.getCreditLimit() != null &&
                        c.getCurrentDebt().compareTo(c.getCreditLimit().multiply(BigDecimal.valueOf(0.8))) > 0) {
                        tag = "Cliente en riesgo";
                    }
    
                    return new CustomerListResponse(
                            c.getId(),
                            c.getName(),
                            c.getPhone(),
                            c.getCurrentDebt(),
                            c.getCreditLimit(),
                            tag,
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

        User user = userRepository.findById(id).orElseThrow();
    
        Optional<Customer> existing = repository.findByPhoneAndUserId(request.phone(), id);

        if (existing.isPresent()) {
            return existing.get().getId();
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
