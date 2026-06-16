package com.retail.intelligence.domain.supplier.mapper;

import com.retail.intelligence.domain.supplier.dto.SupplierResponse;
import com.retail.intelligence.domain.supplier.entity.Supplier;
import org.springframework.stereotype.Component;

@Component
public class SupplierMapper {

    public SupplierResponse toResponse(Supplier supplier) {
        return SupplierResponse.builder()
                .id(supplier.getId())
                .supplierCode(supplier.getSupplierCode())
                .supplierName(supplier.getSupplierName())
                .contactEmail(supplier.getContactEmail())
                .contactPhone(supplier.getContactPhone())
                .region(supplier.getRegion())
                .country(supplier.getCountry())
                .reliabilityScore(supplier.getReliabilityScore())
                .status(supplier.getStatus())
                .createdAt(supplier.getCreatedAt())
                .updatedAt(supplier.getUpdatedAt())
                .build();
    }
}
