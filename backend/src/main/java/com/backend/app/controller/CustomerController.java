package com.backend.app.controller;

import java.util.Set;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.backend.app.model.User;
import com.backend.app.model.dto.CreateCustomerRequest;
import com.backend.app.model.dto.CustomerListResponse;
import com.backend.app.model.dto.CustomerSaleResponse;
import com.backend.app.model.dto.PageResponse;
import com.backend.app.service.CustomerService;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    private final CustomerService service;

    public CustomerController(CustomerService service) {
        this.service = service;
    }

    @PatchMapping("/{customerId}/tags")
    @ResponseStatus(HttpStatus.OK)
    public void updateTags(
        @PathVariable Long customerId,
        @RequestBody Set<String> tags
    ) {
        service.updateCustomerTags(customerId, tags);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public PageResponse<CustomerListResponse> getCustomers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication auth
    ) {
        User user = (User) auth.getPrincipal();

        return PageResponse.from(
                service.getCustomers(user.getId(), page, size)
        );
    }

    @GetMapping("/{customerId}/sales")
    @ResponseStatus(HttpStatus.OK)
    public PageResponse<CustomerSaleResponse> getCustomerSales(
            @PathVariable Long customerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return PageResponse.from(
                service.getSalesByCustomer(customerId, page, size)
        );
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Long createCustomer(@Valid @RequestBody CreateCustomerRequest request, Authentication auth) {
        User user = (User) auth.getPrincipal();
        return service.createCustomer(request, user.getId());
    }
}