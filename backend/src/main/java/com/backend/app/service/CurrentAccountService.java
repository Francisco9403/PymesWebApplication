package com.backend.app.service;

import com.backend.app.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import com.backend.app.model.CurrentAccount;
import com.backend.app.repository.CurrentAccountRepository;
import com.backend.app.exception.BusinessException;

@Service
public class CurrentAccountService {

    private final CurrentAccountRepository currentAccountRepository;

    public CurrentAccountService(CurrentAccountRepository currentAccountRepository) {
        this.currentAccountRepository = currentAccountRepository;
    }

    public CurrentAccount createAccount(CurrentAccount account) {
        return currentAccountRepository.save(account);
    }

    public CurrentAccount getAccountByOwner(Long ownerId) {
        return currentAccountRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta corriente no encontrada para el dueño ID: " + ownerId));
    }

    // A futuro: acá iría la lógica para sumar o restar saldo (balance)
    // cuando se ingresa una factura de compra (OCRInvoiceEntry) o se hace un pago.
}