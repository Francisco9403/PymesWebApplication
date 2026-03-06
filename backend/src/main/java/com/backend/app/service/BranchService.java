package com.backend.app.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.backend.app.model.Branch;
import com.backend.app.model.User;
import com.backend.app.repository.BranchRepository;
import com.backend.app.repository.UserRepository;
import com.backend.app.exception.BusinessException;

@Service
public class BranchService {

    private final BranchRepository repository;
    private final UserRepository userRepository;

    public BranchService(BranchRepository repository, UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    public Branch createBranch(Branch branch, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("User not found"));
    
        Branch savedBranch = repository.save(branch);
    
        user.setBranch(savedBranch);
        userRepository.save(user);
    
        return savedBranch;
    }

    public List<Branch> getBranchesByUser(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("User not found with email: " + email));
    
        if (user.getBranch() == null) {
            return List.of();
        }
    
        return List.of(user.getBranch());
    }

    public Branch getBranchById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new BusinessException("Brand not found with id: " + id));
    }
}