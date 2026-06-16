package com.retail.intelligence.domain.product.mapper;

import com.retail.intelligence.domain.product.dto.ProductResponse;
import com.retail.intelligence.domain.product.entity.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    public ProductResponse toResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .productCode(product.getProductCode())
                .productName(product.getProductName())
                .category(product.getCategory())
                .subCategory(product.getSubCategory())
                .brand(product.getBrand())
                .unitPrice(product.getUnitPrice())
                .costPrice(product.getCostPrice())
                .status(product.getStatus())
                .supplierId(product.getSupplier() != null ? product.getSupplier().getId() : null)
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
}
