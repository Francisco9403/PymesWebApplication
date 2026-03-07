package com.backend.app.mapper;

import com.backend.app.model.Branch;
import com.backend.app.model.dto.BranchDTO;

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
