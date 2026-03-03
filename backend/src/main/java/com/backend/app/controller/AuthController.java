package com.backend.app.controller;

import java.io.IOException;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.backend.app.model.dto.LoginRequest;
import com.backend.app.service.AuthService;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AuthService authService;

    public AuthController(AuthenticationManager authenticationManager, AuthService authService) {
        this.authenticationManager = authenticationManager;
        this.authService = authService;
    }

    @PostMapping("/login")
    public void login(@RequestBody LoginRequest request, HttpServletResponse response) throws IOException {
        try {
            Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
            );
    
            ResponseCookie cookie = authService.createLoginCookie(auth);
            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
            response.setStatus(HttpServletResponse.SC_OK);
    
        } catch (AuthenticationException ex) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"message\": \"Incorrect username or password\"}");
        }
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, String>> me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    
        return ResponseEntity.ok(
                Map.of("username", authentication.getName())
        );
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.OK)
    public void logout(HttpServletResponse response) {
        ResponseCookie cookie = authService.createLogoutCookie();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}