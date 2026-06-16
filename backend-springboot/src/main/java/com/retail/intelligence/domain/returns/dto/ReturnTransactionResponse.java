package com.retail.intelligence.domain.returns.dto;

import com.retail.intelligence.common.enums.ReturnStatus;
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
public class ReturnTransactionResponse {

    private UUID id;
    private String returnCode;
    private UUID salesTransactionId;
    private UUID productId;
    private UUID storeId;
    private UUID customerId;
    private Instant returnDate;
    private Integer quantity;
    private BigDecimal refundAmount;
    private String reason;
    private ReturnStatus status;
    private Instant createdAt;
    private Instant updatedAt;
}
