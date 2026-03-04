package com.backend.app.service;

import org.springframework.stereotype.Service;

import com.backend.app.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository repository;
    
    public UserService(UserRepository repository) {
        this.repository = repository;
    }
}
