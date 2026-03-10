package com.backend.app.model.dto;

import java.util.List;

import com.backend.app.model.CommunicationChannel;

public record CreateSaleRequest(Long branchId, Long customerId, CommunicationChannel channel, List<CreateSaleItemRequest> items) {
}