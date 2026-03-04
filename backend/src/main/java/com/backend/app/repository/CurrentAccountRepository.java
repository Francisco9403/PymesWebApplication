package com.backend.app.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.app.model.CurrentAccount;

@Repository
public interface CurrentAccountRepository extends JpaRepository<CurrentAccount, Long> {

    // Para buscar la cuenta corriente sabiendo el ID del proveedor (o cliente a futuro)
    Optional<CurrentAccount> findByOwnerId(Long ownerId);
}