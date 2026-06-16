package com.retail.intelligence.domain.product.dto;

import com.retail.intelligence.common.enums.ProductStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {

    @NotBlank
    private String productCode;

    @NotBlank
    private String productName;

    @NotBlank
    private String category;

    private String subCategory;

    private String brand;

    @NotNull
    @Positive
    private BigDecimal unitPrice;

    @NotNull
    @Positive
    private BigDecimal costPrice;

    @NotNull
    private ProductStatus status;

    private UUID supplierId;
}
