package com.retail.intelligence.domain.sales.service;

import com.retail.intelligence.common.dto.DomainReadinessResponse;
import com.retail.intelligence.domain.sales.dto.SalesTransactionResponse;
import com.retail.intelligence.domain.sales.mapper.SalesTransactionMapper;
import com.retail.intelligence.domain.sales.repository.SalesTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SalesTransactionService {

    private static final String DOMAIN = "sales";
    private static final String READINESS_MESSAGE = "domain model configured. Full CRUD APIs arrive in Phase 3.";

    private final SalesTransactionRepository salesTransactionRepository;
    private final SalesTransactionMapper salesTransactionMapper;

    public DomainReadinessResponse readiness() {
        return DomainReadinessResponse.builder()
                .domain(DOMAIN)
                .status("READY")
                .message(READINESS_MESSAGE)
                .recordCount(salesTransactionRepository.count())
                .build();
    }

    public List<SalesTransactionResponse> listSalesTransactions() {
        return salesTransactionRepository.findAll().stream()
                .map(salesTransactionMapper::toResponse)
                .toList();
    }
}
