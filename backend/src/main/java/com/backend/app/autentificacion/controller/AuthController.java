package com.backend.app.autentificacion.controller;

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
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.backend.app.autentificacion.config.dto.LoginRequest;
import com.backend.app.autentificacion.service.AuthService;
import com.backend.app.usuario.service.PasswordResetService;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AuthService authService;
    private final PasswordResetService passwordResetService;

    public AuthController(AuthenticationManager authenticationManager, AuthService authService,
            PasswordResetService passwordResetService) {
        this.authenticationManager = authenticationManager;
        this.authService = authService;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/login")
    public void login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) throws IOException {
        try {
            Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
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

    @PostMapping("/forgot-password")
    @ResponseStatus(HttpStatus.OK)
    public void forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        passwordResetService.sendResetEmail(email);
    }

    @PatchMapping("/reset-password")
    @ResponseStatus(HttpStatus.OK)
    public void resetPassword(@RequestBody Map<String, String> body) {
    
        String token = body.get("token");
        String newPassword = body.get("password");
    
        passwordResetService.resetPassword(token, newPassword);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.OK)
    public void logout(HttpServletResponse response) {
        ResponseCookie cookie = authService.createLogoutCookie();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}