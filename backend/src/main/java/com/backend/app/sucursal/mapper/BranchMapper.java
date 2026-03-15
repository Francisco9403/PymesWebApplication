package com.backend.app.sucursal.mapper;

import com.backend.app.sucursal.model.Branch;
import com.backend.app.sucursal.model.dto.BranchDTO;

public class BranchMapper {

    public static BranchDTO toDTO(Branch branch) {
        return new BranchDTO(
                branch.getId(),
                branch.getName(),
                branch.getAddress(),
                branch.getPhone(),
                branch.isPointOfSale()
        );
    }
}
