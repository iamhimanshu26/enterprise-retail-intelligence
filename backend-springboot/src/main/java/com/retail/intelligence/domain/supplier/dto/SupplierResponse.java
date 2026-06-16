package com.retail.intelligence.domain.supplier.dto;

import com.retail.intelligence.common.enums.Region;
import com.retail.intelligence.common.enums.SupplierStatus;
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
public class SupplierResponse {

    private UUID id;
    private String supplierCode;
    private String supplierName;
    private String contactEmail;
    private String contactPhone;
    private Region region;
    private String country;
    private BigDecimal reliabilityScore;
    private SupplierStatus status;
    private Instant createdAt;
    private Instant updatedAt;
}
