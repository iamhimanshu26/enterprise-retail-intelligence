package com.retail.intelligence.domain.store.service;

import com.retail.intelligence.common.dto.DomainReadinessResponse;
import com.retail.intelligence.domain.store.dto.StoreResponse;
import com.retail.intelligence.domain.store.mapper.StoreMapper;
import com.retail.intelligence.domain.store.repository.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StoreService {

    private static final String DOMAIN = "store";
    private static final String READINESS_MESSAGE = "domain model configured. Full CRUD APIs arrive in Phase 3.";

    private final StoreRepository storeRepository;
    private final StoreMapper storeMapper;

    public DomainReadinessResponse readiness() {
        return DomainReadinessResponse.builder()
                .domain(DOMAIN)
                .status("READY")
                .message(READINESS_MESSAGE)
                .recordCount(storeRepository.count())
                .build();
    }

    public List<StoreResponse> listStores() {
        return storeRepository.findAll().stream()
                .map(storeMapper::toResponse)
                .toList();
    }
}
