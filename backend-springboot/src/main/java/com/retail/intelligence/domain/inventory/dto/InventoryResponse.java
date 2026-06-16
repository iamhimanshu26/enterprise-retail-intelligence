package com.retail.intelligence.domain.inventory.dto;

import com.retail.intelligence.common.enums.StockStatus;
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
public class InventoryResponse {

    private UUID id;
    private UUID storeId;
    private UUID productId;
    private Integer quantityOnHand;
    private Integer reorderLevel;
    private Integer reorderQuantity;
    private StockStatus stockStatus;
    private Instant lastRestockedAt;
    private Instant createdAt;
    private Instant updatedAt;
}
