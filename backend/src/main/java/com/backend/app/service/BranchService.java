package com.backend.app.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.backend.app.model.Branch;
import com.backend.app.model.User;
import com.backend.app.model.dto.BranchDTO;
import com.backend.app.repository.BranchRepository;
import com.backend.app.exception.BusinessException;
import com.backend.app.mapper.BranchMapper;

@Service
public class BranchService {

    private final BranchRepository repository;

    public BranchService(BranchRepository repository) {
        this.repository = repository;
    }

    public Branch createBranch(Branch branch, User user) {

        branch.setUser(user);

        return repository.save(branch);
    }

    public List<BranchDTO> getBranchesByUser(User user) {

        return repository.findByUser(user)
                .stream()
                .map(BranchMapper::toDTO)
                .toList();
    }

    public BranchDTO getBranchById(Long id) {

        Branch branch = repository.findById(id)
                .orElseThrow(() -> new BusinessException("Branch not found with id: " + id));

        return BranchMapper.toDTO(branch);
    }
}