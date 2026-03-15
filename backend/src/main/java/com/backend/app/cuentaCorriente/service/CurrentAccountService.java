package com.backend.app.cuentaCorriente.service;

import com.backend.app.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory; // 🚀 Importaciones de SLF4J
import org.springframework.stereotype.Service;

import com.backend.app.cuentaCorriente.model.CurrentAccount;
import com.backend.app.cuentaCorriente.repository.CurrentAccountRepository;

@Service
public class CurrentAccountService {

    // 🚀 Definición del Logger para auditar balances y estados de cuenta
    private static final Logger log = LoggerFactory.getLogger(CurrentAccountService.class);

    private final CurrentAccountRepository currentAccountRepository;

    public CurrentAccountService(CurrentAccountRepository currentAccountRepository) {
        this.currentAccountRepository = currentAccountRepository;
    }

    public CurrentAccount createAccount(CurrentAccount account) {
        log.info("Creando nueva Cuenta Corriente para el dueño ID: {}. Saldo inicial: ${}",
                account.getOwnerId(), account.getBalance());

        CurrentAccount savedAccount = currentAccountRepository.save(account);

        log.info(" Cuenta Corriente creada con éxito. ID Interno: {}", savedAccount.getId());
        return savedAccount;
    }

    public CurrentAccount getAccountByOwner(Long ownerId) {
        log.debug("Consultando estado de Cuenta Corriente para el dueño ID: {}", ownerId);

        return currentAccountRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> {
                    log.warn("Consulta fallida: No se encontró Cuenta Corriente para el dueño ID: {}", ownerId);
                    return new ResourceNotFoundException("Cuenta corriente no encontrada para el dueño ID: " + ownerId);
                });
    }

    // A futuro: acá iría la lógica para sumar o restar saldo (balance)
    // cuando se ingresa una factura de compra (OCRInvoiceEntry) o se hace un pago.
}