package com.retail.intelligence.domain.returns.controller;

import com.retail.intelligence.common.ApiResponse;
import com.retail.intelligence.common.dto.DomainReadinessResponse;
import com.retail.intelligence.domain.returns.dto.ReturnTransactionResponse;
import com.retail.intelligence.domain.returns.service.ReturnTransactionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/returns")
@RequiredArgsConstructor
@Tag(name = "Returns", description = "Return transaction domain API")
public class ReturnController {

    private final ReturnTransactionService returnTransactionService;

    @GetMapping("/readiness")
    public ResponseEntity<ApiResponse<DomainReadinessResponse>> readiness() {
        return ResponseEntity.ok(ApiResponse.success(returnTransactionService.readiness()));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ReturnTransactionResponse>>> listReturnTransactions() {
        return ResponseEntity.ok(ApiResponse.success(returnTransactionService.listReturnTransactions()));
    }
}
