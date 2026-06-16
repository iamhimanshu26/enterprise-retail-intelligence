package com.retail.intelligence.domain.store.dto;

import com.retail.intelligence.common.enums.Region;
import com.retail.intelligence.common.enums.StoreStatus;
import com.retail.intelligence.common.enums.StoreType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoreResponse {

    private UUID id;
    private String storeCode;
    private String storeName;
    private Region region;
    private String prefecture;
    private String city;
    private String address;
    private StoreType storeType;
    private LocalDate openingDate;
    private StoreStatus status;
    private Instant createdAt;
    private Instant updatedAt;
}
