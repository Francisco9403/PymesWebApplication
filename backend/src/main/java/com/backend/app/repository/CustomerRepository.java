package com.backend.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.app.model.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    
}
