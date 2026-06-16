package com.retail.intelligence.domain.returns.dto;

import com.retail.intelligence.common.enums.ReturnStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
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
public class ReturnTransactionRequest {

    @NotBlank
    private String returnCode;

    @NotNull
    private UUID salesTransactionId;

    @NotNull
    private UUID productId;

    @NotNull
    private UUID storeId;

    private UUID customerId;

    @NotNull
    private Instant returnDate;

    @NotNull
    @Min(1)
    private Integer quantity;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal refundAmount;

    private String reason;

    @NotNull
    private ReturnStatus status;
}
