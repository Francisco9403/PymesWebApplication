package com.backend.app.config;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.backend.app.model.User;
import com.backend.app.repository.UserRepository;
import com.backend.app.service.JwtService;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {
    private final UserRepository repository;
    private final JwtService jwtService;

    public JwtFilter(UserRepository repository, JwtService jwtService) {
        this.repository = repository;
        this.jwtService = jwtService;
    }

    @Value("${cookie.secure}")
    private boolean isSecure;

    @Value("${cookie.domain}")
    private String domain;

    @Value("${cookie.sameSite}")
    private String sameSite;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getServletPath();
        if (path.startsWith("/auth/login") || path.startsWith("/auth/logout")) {
            filterChain.doFilter(request, response);
            return;
        }
    
        String token = null;
    
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }
    
        if (token == null && request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("jwt".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }
    
        if (token != null) {
            try {
                Claims claims = jwtService.validateToken(token);
                String email = claims.getSubject();
    
                User user = repository.findByEmail(email)
                        .orElseThrow();

                if (!user.isActivo()) {
                    throw new RuntimeException("Usuario inactivo");
                }
    
                List<GrantedAuthority> authorities =
                    List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
    
                UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(user, null, authorities);
    
                SecurityContextHolder.getContext().setAuthentication(auth);
    
            } catch (Exception e) {
                SecurityContextHolder.clearContext();
                
                ResponseCookie cookie = ResponseCookie.from("jwt", "")
                    .httpOnly(true)
                    .secure(isSecure)
                    .path("/")
                    .domain(domain)
                    .maxAge(0)
                    .sameSite(sameSite)
                    .build();

                response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            }
        }
    
        filterChain.doFilter(request, response);
    }


    @Bean
    public AuthenticationManager authenticationManager(
           /*  */ AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    /* @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    } */
}
