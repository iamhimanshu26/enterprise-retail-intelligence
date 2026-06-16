package com.retail.intelligence.domain.returns.service;

import com.retail.intelligence.common.dto.DomainReadinessResponse;
import com.retail.intelligence.domain.returns.dto.ReturnTransactionResponse;
import com.retail.intelligence.domain.returns.mapper.ReturnTransactionMapper;
import com.retail.intelligence.domain.returns.repository.ReturnTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReturnTransactionService {

    private static final String DOMAIN = "returns";
    private static final String READINESS_MESSAGE = "domain model configured. Full CRUD APIs arrive in Phase 3.";

    private final ReturnTransactionRepository returnTransactionRepository;
    private final ReturnTransactionMapper returnTransactionMapper;

    public DomainReadinessResponse readiness() {
        return DomainReadinessResponse.builder()
                .domain(DOMAIN)
                .status("READY")
                .message(READINESS_MESSAGE)
                .recordCount(returnTransactionRepository.count())
                .build();
    }

    public List<ReturnTransactionResponse> listReturnTransactions() {
        return returnTransactionRepository.findAll().stream()
                .map(returnTransactionMapper::toResponse)
                .toList();
    }
}
