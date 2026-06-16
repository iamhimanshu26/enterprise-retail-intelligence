package com.retail.intelligence.domain.promotion.controller;

import com.retail.intelligence.common.ApiResponse;
import com.retail.intelligence.common.dto.DomainReadinessResponse;
import com.retail.intelligence.domain.promotion.dto.PromotionResponse;
import com.retail.intelligence.domain.promotion.service.PromotionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/promotions")
@RequiredArgsConstructor
@Tag(name = "Promotions", description = "Promotion domain API")
public class PromotionController {

    private final PromotionService promotionService;

    @GetMapping("/readiness")
    public ResponseEntity<ApiResponse<DomainReadinessResponse>> readiness() {
        return ResponseEntity.ok(ApiResponse.success(promotionService.readiness()));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PromotionResponse>>> listPromotions() {
        return ResponseEntity.ok(ApiResponse.success(promotionService.listPromotions()));
    }
}
