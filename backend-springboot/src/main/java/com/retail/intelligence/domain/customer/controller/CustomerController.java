package com.retail.intelligence.domain.customer.controller;

import com.retail.intelligence.common.ApiResponse;
import com.retail.intelligence.common.dto.DomainReadinessResponse;
import com.retail.intelligence.domain.customer.dto.CustomerResponse;
import com.retail.intelligence.domain.customer.service.CustomerService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
@Tag(name = "Customers", description = "Customer domain API")
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping("/readiness")
    public ResponseEntity<ApiResponse<DomainReadinessResponse>> readiness() {
        return ResponseEntity.ok(ApiResponse.success(customerService.readiness()));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CustomerResponse>>> listCustomers() {
        return ResponseEntity.ok(ApiResponse.success(customerService.listCustomers()));
    }
}
