package com.retail.intelligence.domain.customer.dto;

import com.retail.intelligence.common.enums.CustomerStatus;
import com.retail.intelligence.common.enums.MembershipTier;
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
public class CustomerResponse {

    private UUID id;
    private String customerCode;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String gender;
    private String ageGroup;
    private String prefecture;
    private String city;
    private MembershipTier membershipTier;
    private LocalDate joinedDate;
    private CustomerStatus status;
    private Instant createdAt;
    private Instant updatedAt;
}
