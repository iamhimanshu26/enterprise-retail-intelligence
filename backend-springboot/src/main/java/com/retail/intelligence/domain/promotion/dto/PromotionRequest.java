package com.retail.intelligence.domain.promotion.dto;

import com.retail.intelligence.common.enums.PromotionStatus;
import com.retail.intelligence.common.enums.PromotionType;
import com.retail.intelligence.common.enums.Region;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PromotionRequest {

    @NotBlank
    private String promotionCode;

    @NotBlank
    private String promotionName;

    @NotNull
    private PromotionType promotionType;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;

    @DecimalMin("0.0")
    private BigDecimal discountRate;

    private String targetCategory;

    private Region targetRegion;

    @NotNull
    private PromotionStatus status;
}
