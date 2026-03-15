package com.backend.app.cliente.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.app.cliente.model.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    boolean existsByPhoneAndUserId(String phone, Long userId);
    Optional<Customer> findByPhoneAndUserId(String phone, Long userId);

    Page<Customer> findByUserId(Long userId, Pageable pageable);
}
