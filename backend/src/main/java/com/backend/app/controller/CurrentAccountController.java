package com.backend.app.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.app.model.CurrentAccount;
import com.backend.app.service.CurrentAccountService;

@RestController
@RequestMapping("/api/accounts")
public class CurrentAccountController {

    private final CurrentAccountService currentAccountService;

    public CurrentAccountController(CurrentAccountService currentAccountService) {
        this.currentAccountService = currentAccountService;
    }

    @PostMapping
    public ResponseEntity<CurrentAccount> createAccount(@Valid @RequestBody CurrentAccount account) { // 🚀 Agregado @Valid
        CurrentAccount createdAccount = currentAccountService.createAccount(account);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdAccount);
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<CurrentAccount> getAccountByOwnerId(@PathVariable Long ownerId) {
        return ResponseEntity.ok(currentAccountService.getAccountByOwner(ownerId));
    }
}