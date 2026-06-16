package com.retail.intelligence.domain.inventory.mapper;

import com.retail.intelligence.domain.inventory.dto.InventoryResponse;
import com.retail.intelligence.domain.inventory.entity.Inventory;
import org.springframework.stereotype.Component;

@Component
public class InventoryMapper {

    public InventoryResponse toResponse(Inventory inventory) {
        return InventoryResponse.builder()
                .id(inventory.getId())
                .storeId(inventory.getStore() != null ? inventory.getStore().getId() : null)
                .productId(inventory.getProduct() != null ? inventory.getProduct().getId() : null)
                .quantityOnHand(inventory.getQuantityOnHand())
                .reorderLevel(inventory.getReorderLevel())
                .reorderQuantity(inventory.getReorderQuantity())
                .stockStatus(inventory.getStockStatus())
                .lastRestockedAt(inventory.getLastRestockedAt())
                .createdAt(inventory.getCreatedAt())
                .updatedAt(inventory.getUpdatedAt())
                .build();
    }
}
