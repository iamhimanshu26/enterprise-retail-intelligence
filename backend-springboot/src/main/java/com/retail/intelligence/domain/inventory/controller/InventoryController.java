package com.retail.intelligence.domain.inventory.controller;

import com.retail.intelligence.common.ApiResponse;
import com.retail.intelligence.common.dto.DomainReadinessResponse;
import com.retail.intelligence.domain.inventory.dto.InventoryResponse;
import com.retail.intelligence.domain.inventory.service.InventoryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
@Tag(name = "Inventory", description = "Inventory domain API")
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping("/readiness")
    public ResponseEntity<ApiResponse<DomainReadinessResponse>> readiness() {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.readiness()));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<InventoryResponse>>> listInventory() {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.listInventory()));
    }
}
