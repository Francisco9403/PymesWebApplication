package com.backend.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.app.model.Branch;
import com.backend.app.model.User;

@Repository
public interface BranchRepository extends JpaRepository<Branch, Long> {
    // Spring Data JPA ya nos regala save(), findAll(), findById(), etc.
    List<Branch> findByUser(User user);
}