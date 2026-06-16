package com.retail.intelligence.domain.product.dto;

import com.retail.intelligence.common.enums.ProductStatus;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

class ProductRequestValidationTest {

    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    @Test
    void rejectsBlankProductCode() {
        ProductRequest request = validRequest();
        request.setProductCode("");

        assertThat(validator.validate(request)).isNotEmpty();
    }

    @Test
    void rejectsNegativeUnitPrice() {
        ProductRequest request = validRequest();
        request.setUnitPrice(BigDecimal.valueOf(-1));

        assertThat(validator.validate(request)).isNotEmpty();
    }

    private ProductRequest validRequest() {
        ProductRequest request = new ProductRequest();
        request.setProductCode("SKU-1001");
        request.setProductName("Premium Rice");
        request.setCategory("Grocery");
        request.setUnitPrice(BigDecimal.valueOf(12.50));
        request.setCostPrice(BigDecimal.valueOf(8.00));
        request.setStatus(ProductStatus.ACTIVE);
        return request;
    }
}
