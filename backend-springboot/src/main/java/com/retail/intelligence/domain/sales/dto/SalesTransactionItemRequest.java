package com.retail.intelligence.domain.sales.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalesTransactionItemRequest {

    @NotNull
    private UUID salesTransactionId;

    @NotNull
    private UUID productId;

    @NotNull
    @Min(1)
    private Integer quantity;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal unitPrice;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal costPrice;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal discountAmount;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal lineTotal;

    @NotNull
    private BigDecimal grossProfit;
}
