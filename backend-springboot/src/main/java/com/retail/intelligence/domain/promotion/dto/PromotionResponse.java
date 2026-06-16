package com.retail.intelligence.domain.promotion.dto;

import com.retail.intelligence.common.enums.PromotionStatus;
import com.retail.intelligence.common.enums.PromotionType;
import com.retail.intelligence.common.enums.Region;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PromotionResponse {

    private UUID id;
    private String promotionCode;
    private String promotionName;
    private PromotionType promotionType;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal discountRate;
    private String targetCategory;
    private Region targetRegion;
    private PromotionStatus status;
    private Instant createdAt;
    private Instant updatedAt;
}
