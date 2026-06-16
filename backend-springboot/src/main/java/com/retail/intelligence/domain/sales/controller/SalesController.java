package com.retail.intelligence.domain.sales.controller;

import com.retail.intelligence.common.ApiResponse;
import com.retail.intelligence.common.dto.DomainReadinessResponse;
import com.retail.intelligence.domain.sales.dto.SalesTransactionResponse;
import com.retail.intelligence.domain.sales.service.SalesTransactionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/sales")
@RequiredArgsConstructor
@Tag(name = "Sales", description = "Sales transaction domain API")
public class SalesController {

    private final SalesTransactionService salesTransactionService;

    @GetMapping("/readiness")
    public ResponseEntity<ApiResponse<DomainReadinessResponse>> readiness() {
        return ResponseEntity.ok(ApiResponse.success(salesTransactionService.readiness()));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SalesTransactionResponse>>> listSalesTransactions() {
        return ResponseEntity.ok(ApiResponse.success(salesTransactionService.listSalesTransactions()));
    }
}
