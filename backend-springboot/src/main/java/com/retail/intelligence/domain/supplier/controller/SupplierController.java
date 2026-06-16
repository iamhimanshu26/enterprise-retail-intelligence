package com.retail.intelligence.domain.supplier.controller;

import com.retail.intelligence.common.ApiResponse;
import com.retail.intelligence.common.dto.DomainReadinessResponse;
import com.retail.intelligence.domain.supplier.dto.SupplierResponse;
import com.retail.intelligence.domain.supplier.service.SupplierService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/suppliers")
@RequiredArgsConstructor
@Tag(name = "Suppliers", description = "Supplier domain API")
public class SupplierController {

    private final SupplierService supplierService;

    @GetMapping("/readiness")
    public ResponseEntity<ApiResponse<DomainReadinessResponse>> readiness() {
        return ResponseEntity.ok(ApiResponse.success(supplierService.readiness()));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SupplierResponse>>> listSuppliers() {
        return ResponseEntity.ok(ApiResponse.success(supplierService.listSuppliers()));
    }
}
