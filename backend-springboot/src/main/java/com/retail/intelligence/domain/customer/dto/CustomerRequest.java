package com.retail.intelligence.domain.customer.dto;

import com.retail.intelligence.common.enums.CustomerStatus;
import com.retail.intelligence.common.enums.MembershipTier;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerRequest {

    @NotBlank
    private String customerCode;

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @Email
    private String email;

    private String phone;

    private String gender;

    private String ageGroup;

    private String prefecture;

    private String city;

    @NotNull
    private MembershipTier membershipTier;

    @NotNull
    @PastOrPresent
    private LocalDate joinedDate;

    @NotNull
    private CustomerStatus status;
}
