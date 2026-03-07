package com.backend.app.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.backend.app.model.Branch;
import com.backend.app.model.User;
import com.backend.app.model.dto.BranchDTO;
import com.backend.app.service.BranchService;

@RestController
@RequestMapping("/api/branches")
public class BranchController {

    private final BranchService branchService;

    public BranchController(BranchService branchService) {
        this.branchService = branchService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void createBranch(@RequestBody Branch branch, Authentication auth) {
        User user = (User) auth.getPrincipal();
        branchService.createBranch(branch, user);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<BranchDTO> getAllBranches(Authentication auth) {
        User user = (User) auth.getPrincipal();
        return branchService.getBranchesByUser(user);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public BranchDTO getBranchById(@PathVariable Long id) {
        return branchService.getBranchById(id);
    }
}