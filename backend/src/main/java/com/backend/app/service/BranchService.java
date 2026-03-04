package com.backend.app.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.backend.app.model.Branch;
import com.backend.app.repository.BranchRepository;
import com.backend.app.exception.BusinessException;

@Service
public class BranchService {

    private final BranchRepository branchRepository;

    public BranchService(BranchRepository branchRepository) {
        this.branchRepository = branchRepository;
    }

    public Branch createBranch(Branch branch) {
        return branchRepository.save(branch);
    }

    public List<Branch> getAllBranches() {
        return branchRepository.findAll();
    }

    public Branch getBranchById(Long id) {
        return branchRepository.findById(id)
                .orElseThrow(() -> new BusinessException(id)); // Reutilizamos tu excepción personalizada
    }
}