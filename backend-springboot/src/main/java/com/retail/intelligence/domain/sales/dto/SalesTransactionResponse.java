package com.retail.intelligence.domain.sales.dto;

import com.retail.intelligence.common.enums.PaymentMethod;
import com.retail.intelligence.common.enums.TransactionStatus;
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
public class SalesTransactionResponse {

    private UUID id;
    private String transactionCode;
    private UUID storeId;
    private UUID customerId;
    private Instant transactionDate;
    private PaymentMethod paymentMethod;
    private BigDecimal totalAmount;
    private BigDecimal totalCost;
    private BigDecimal grossProfit;
    private BigDecimal discountAmount;
    private BigDecimal taxAmount;
    private TransactionStatus transactionStatus;
    private Instant createdAt;
    private Instant updatedAt;
}
