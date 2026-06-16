package com.retail.intelligence.domain.store.controller;

import com.retail.intelligence.common.ApiResponse;
import com.retail.intelligence.common.dto.DomainReadinessResponse;
import com.retail.intelligence.domain.store.dto.StoreResponse;
import com.retail.intelligence.domain.store.service.StoreService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/stores")
@RequiredArgsConstructor
@Tag(name = "Stores", description = "Store domain API")
public class StoreController {

    private final StoreService storeService;

    @GetMapping("/readiness")
    public ResponseEntity<ApiResponse<DomainReadinessResponse>> readiness() {
        return ResponseEntity.ok(ApiResponse.success(storeService.readiness()));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<StoreResponse>>> listStores() {
        return ResponseEntity.ok(ApiResponse.success(storeService.listStores()));
    }
}
