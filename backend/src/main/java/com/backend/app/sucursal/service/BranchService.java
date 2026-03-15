package com.backend.app.sucursal.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory; // 🚀 Importaciones de SLF4J
import com.backend.app.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import com.backend.app.sucursal.model.Branch;
import com.backend.app.usuario.model.User;
import com.backend.app.sucursal.model.dto.BranchDTO;
import com.backend.app.sucursal.respository.BranchRepository;
import com.backend.app.sucursal.mapper.BranchMapper;

@Service
public class BranchService {

    // 🚀 Definición del Logger para esta clase
    private static final Logger log = LoggerFactory.getLogger(BranchService.class);

    private final BranchRepository repository;

    public BranchService(BranchRepository repository) {
        this.repository = repository;
    }

    public Branch createBranch(Branch branch, User user) {
        log.info("Iniciando creación de sucursal: '{}' para el usuario ID: {}", branch.getName(), user.getId());

        branch.setUser(user);
        Branch savedBranch = repository.save(branch);

        log.info("Sucursal '{}' creada con éxito. Asignado ID: {}", savedBranch.getName(), savedBranch.getId());
        return savedBranch;
    }

    public List<BranchDTO> getBranchesByUser(User user) {
        log.debug("Consultando todas las sucursales asociadas al usuario ID: {}", user.getId());

        List<Branch> branches = repository.findByUser(user);

        log.info("Se encontraron {} sucursales para el usuario: {}", branches.size(), user.getUsername());
        return branches.stream()
                .map(BranchMapper::toDTO)
                .toList();
    }

    public BranchDTO getBranchById(Long id) {
        log.debug("Buscando sucursal por ID: {}", id);

        Branch branch = repository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Consulta fallida: No se encontró la sucursal con ID: {}", id);
                    return new ResourceNotFoundException("Sucursal no encontrada con ID: " + id);
                });

        return BranchMapper.toDTO(branch);
    }
}