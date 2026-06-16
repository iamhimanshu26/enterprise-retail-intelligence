package com.retail.intelligence.domain.promotion.service;

import com.retail.intelligence.common.dto.DomainReadinessResponse;
import com.retail.intelligence.domain.promotion.dto.PromotionResponse;
import com.retail.intelligence.domain.promotion.mapper.PromotionMapper;
import com.retail.intelligence.domain.promotion.repository.PromotionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PromotionService {

    private static final String DOMAIN = "promotion";
    private static final String READINESS_MESSAGE = "domain model configured. Full CRUD APIs arrive in Phase 3.";

    private final PromotionRepository promotionRepository;
    private final PromotionMapper promotionMapper;

    public DomainReadinessResponse readiness() {
        return DomainReadinessResponse.builder()
                .domain(DOMAIN)
                .status("READY")
                .message(READINESS_MESSAGE)
                .recordCount(promotionRepository.count())
                .build();
    }

    public List<PromotionResponse> listPromotions() {
        return promotionRepository.findAll().stream()
                .map(promotionMapper::toResponse)
                .toList();
    }
}
