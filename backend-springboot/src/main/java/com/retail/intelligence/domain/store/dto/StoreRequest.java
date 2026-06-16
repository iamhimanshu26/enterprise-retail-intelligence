package com.retail.intelligence.domain.store.dto;

import com.retail.intelligence.common.enums.Region;
import com.retail.intelligence.common.enums.StoreStatus;
import com.retail.intelligence.common.enums.StoreType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoreRequest {

    private String storeCode;
    private String storeName;
    private Region region;
    private String prefecture;
    private String city;
    private String address;
    private StoreType storeType;
    private LocalDate openingDate;
    private StoreStatus status;
}
