package com.backend.app.usuario.config;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.backend.app.usuario.service.PasswordResetService;

@Component
public class TokenCleanupScheduler {
    private final PasswordResetService passwordResetService;

    public TokenCleanupScheduler(PasswordResetService passwordResetService) {
        this.passwordResetService = passwordResetService;
    }

    @Scheduled(fixedRate = 60 * 60 * 1000) // cada 1 hora
    public void cleanup() {
        passwordResetService.cleanExpiredTokens();
    }
}
