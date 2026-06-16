package com.retail.intelligence.domain.supplier.dto;

import com.retail.intelligence.common.enums.Region;
import com.retail.intelligence.common.enums.SupplierStatus;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SupplierRequest {

    @NotBlank
    private String supplierCode;

    @NotBlank
    private String supplierName;

    @Email
    private String contactEmail;

    private String contactPhone;

    private Region region;

    @NotBlank
    private String country;

    @NotNull
    @DecimalMin("0.0")
    @DecimalMax("100.0")
    private BigDecimal reliabilityScore;

    @NotNull
    private SupplierStatus status;
}
