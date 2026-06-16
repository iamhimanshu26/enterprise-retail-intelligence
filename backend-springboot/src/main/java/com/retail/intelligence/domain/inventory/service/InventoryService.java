package com.retail.intelligence.domain.inventory.service;

import com.retail.intelligence.common.dto.DomainReadinessResponse;
import com.retail.intelligence.domain.inventory.dto.InventoryResponse;
import com.retail.intelligence.domain.inventory.mapper.InventoryMapper;
import com.retail.intelligence.domain.inventory.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private static final String DOMAIN = "inventory";
    private static final String READINESS_MESSAGE = "domain model configured. Full CRUD APIs arrive in Phase 3.";

    private final InventoryRepository inventoryRepository;
    private final InventoryMapper inventoryMapper;

    public DomainReadinessResponse readiness() {
        return DomainReadinessResponse.builder()
                .domain(DOMAIN)
                .status("READY")
                .message(READINESS_MESSAGE)
                .recordCount(inventoryRepository.count())
                .build();
    }

    public List<InventoryResponse> listInventory() {
        return inventoryRepository.findAll().stream()
                .map(inventoryMapper::toResponse)
                .toList();
    }
}
