package com.retail.intelligence.domain.sales.dto;

import com.retail.intelligence.common.enums.PaymentMethod;
import com.retail.intelligence.common.enums.TransactionStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalesTransactionRequest {

    @NotBlank
    private String transactionCode;

    @NotNull
    private UUID storeId;

    private UUID customerId;

    @NotNull
    private Instant transactionDate;

    @NotNull
    private PaymentMethod paymentMethod;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal totalAmount;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal totalCost;

    @NotNull
    private BigDecimal grossProfit;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal discountAmount;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal taxAmount;

    @NotNull
    private TransactionStatus transactionStatus;
}
