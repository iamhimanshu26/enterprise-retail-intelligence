package com.retail.intelligence.domain.promotion.mapper;

import com.retail.intelligence.domain.promotion.dto.PromotionResponse;
import com.retail.intelligence.domain.promotion.entity.Promotion;
import org.springframework.stereotype.Component;

@Component
public class PromotionMapper {

    public PromotionResponse toResponse(Promotion promotion) {
        return PromotionResponse.builder()
                .id(promotion.getId())
                .promotionCode(promotion.getPromotionCode())
                .promotionName(promotion.getPromotionName())
                .promotionType(promotion.getPromotionType())
                .startDate(promotion.getStartDate())
                .endDate(promotion.getEndDate())
                .discountRate(promotion.getDiscountRate())
                .targetCategory(promotion.getTargetCategory())
                .targetRegion(promotion.getTargetRegion())
                .status(promotion.getStatus())
                .createdAt(promotion.getCreatedAt())
                .updatedAt(promotion.getUpdatedAt())
                .build();
    }
}
