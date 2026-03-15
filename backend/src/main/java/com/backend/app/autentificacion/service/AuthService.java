package com.backend.app.autentificacion.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory; // 🚀 Importaciones de SLF4J
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    // 🚀 Definición del Logger para auditar accesos y sesiones
    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final JwtService jwtService;

    @Value("${cookie.secure}")
    private boolean isSecure;

    @Value("${cookie.domain}")
    private String domain;

    @Value("${cookie.sameSite}")
    private String sameSite;

    @Value("${jwt.expirationHours}")
    private int expirationHours;

    public AuthService(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    public ResponseCookie createLoginCookie(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();

        log.info("🔐 Iniciando creación de cookie de sesión para el usuario: {}", username);

        // Extraemos el rol (authority) para el token
        String role = userDetails.getAuthorities()
                .iterator()
                .next()
                .getAuthority();

        String token = jwtService.generateToken(username, role);

        int maxAge = expirationHours * 3600;

        log.debug("Configurando cookie: Domain={}, Secure={}, SameSite={}, MaxAge={}s",
                domain, isSecure, sameSite, maxAge);

        ResponseCookie cookie = ResponseCookie.from("token", token)
                .httpOnly(true)
                .secure(isSecure)
                .path("/")
                .domain(domain)
                .maxAge(maxAge)
                .sameSite(sameSite)
                .build();

        log.info(" Cookie de login generada exitosamente para: {}", username);
        return cookie;
    }

    public ResponseCookie createLogoutCookie() {
        log.info(" Procesando solicitud de cierre de sesión (Logout).");

        ResponseCookie cookie = ResponseCookie.from("token", "")
                .httpOnly(true)
                .secure(isSecure)
                .path("/")
                .domain(domain)
                .maxAge(0)
                .sameSite(sameSite)
                .build();

        log.debug("Cookie de logout generada (MaxAge=0) para limpiar el navegador.");
        return cookie;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        // No logueamos mucho aquí porque es configuración de Spring al arrancar
        return config.getAuthenticationManager();
    }
}