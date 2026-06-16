package com.retail.intelligence.domain.inventory.dto;

import com.retail.intelligence.common.enums.StockStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryRequest {

    @NotNull
    private UUID storeId;

    @NotNull
    private UUID productId;

    @NotNull
    @Min(0)
    private Integer quantityOnHand;

    @NotNull
    @Min(0)
    private Integer reorderLevel;

    @NotNull
    @Min(0)
    private Integer reorderQuantity;

    @NotNull
    private StockStatus stockStatus;

    private Instant lastRestockedAt;
}
