package com.retail.intelligence.domain.product.dto;

import com.retail.intelligence.common.enums.ProductStatus;
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
public class ProductResponse {

    private UUID id;
    private String productCode;
    private String productName;
    private String category;
    private String subCategory;
    private String brand;
    private BigDecimal unitPrice;
    private BigDecimal costPrice;
    private ProductStatus status;
    private UUID supplierId;
    private Instant createdAt;
    private Instant updatedAt;
}
