package com.retail.intelligence.domain.store.mapper;

import com.retail.intelligence.domain.store.dto.StoreResponse;
import com.retail.intelligence.domain.store.entity.Store;
import org.springframework.stereotype.Component;

@Component
public class StoreMapper {

    public StoreResponse toResponse(Store store) {
        return StoreResponse.builder()
                .id(store.getId())
                .storeCode(store.getStoreCode())
                .storeName(store.getStoreName())
                .region(store.getRegion())
                .prefecture(store.getPrefecture())
                .city(store.getCity())
                .address(store.getAddress())
                .storeType(store.getStoreType())
                .openingDate(store.getOpeningDate())
                .status(store.getStatus())
                .createdAt(store.getCreatedAt())
                .updatedAt(store.getUpdatedAt())
                .build();
    }
}
