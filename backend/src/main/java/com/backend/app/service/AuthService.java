package com.backend.app.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

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

        String token = jwtService.generateToken(userDetails.getUsername(),
            userDetails.getAuthorities()
                    .iterator()
                    .next()
                    .getAuthority());
        int maxAge = expirationHours * 3600;

        return ResponseCookie.from("token", token)
                .httpOnly(true)
                .secure(isSecure)
                .path("/")
                .domain(domain)
                .maxAge(maxAge)
                .sameSite(sameSite)
                .build();
    }

    public ResponseCookie createLogoutCookie() {
        return ResponseCookie.from("token", "")
                .httpOnly(true)
                .secure(isSecure)
                .path("/")
                .domain(domain)
                .maxAge(0)
                .sameSite(sameSite)
                .build();
    }
}