package com.backend.app.autentificacion.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory; // 🚀 Importaciones de SLF4J
import com.backend.app.exception.UnauthorizedException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;

@Service
public class JwtService {

    // 🚀 Logger para monitorear la validez de los tokens y accesos
    private static final Logger log = LoggerFactory.getLogger(JwtService.class);

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expirationHours}")
    private long expiration;

    private SecretKey getSigningKey() {
        // Logueamos solo en DEBUG para verificar que la clave se carga,
        // sin mostrar el contenido de la clave por seguridad.
        log.debug("Cargando clave de firma JWT desde el secreto configurado.");
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String email, String role) {
        log.info("Generando nuevo token JWT para el usuario: {} con rol: {}", email, role);

        Instant now = Instant.now();
        Instant expiryDate = now.plus(expiration, ChronoUnit.HOURS);

        String token = Jwts.builder()
                .subject(email)
                .claim("rol", role)
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiryDate))
                .signWith(getSigningKey())
                .compact();

        log.info(" Token generado exitosamente. Expira el: {}", expiryDate);
        return token;
    }

    public Claims validateToken(String token) {
        log.debug("Iniciando validación de token JWT...");

        try {
            return Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (Exception e) {
            // Logueamos el error específico (Expirado, Mal formado, etc.)
            // antes de lanzar la excepción genérica 401.
            log.warn(" Fallo en la validación del token: {}", e.getMessage());
            throw new UnauthorizedException("Token JWT inválido o expirado");
        }
    }

    public String extractDni(String token) {
        // En tu caso, el Subject es el email/DNI del usuario.
        String subject = validateToken(token).getSubject();
        log.debug("Identidad extraída del token: {}", subject);
        return subject;
    }
}