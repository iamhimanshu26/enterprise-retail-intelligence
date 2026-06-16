package com.retail.intelligence.domain.customer.mapper;

import com.retail.intelligence.domain.customer.dto.CustomerResponse;
import com.retail.intelligence.domain.customer.entity.Customer;
import org.springframework.stereotype.Component;

@Component
public class CustomerMapper {

    public CustomerResponse toResponse(Customer customer) {
        return CustomerResponse.builder()
                .id(customer.getId())
                .customerCode(customer.getCustomerCode())
                .firstName(customer.getFirstName())
                .lastName(customer.getLastName())
                .email(customer.getEmail())
                .phone(customer.getPhone())
                .gender(customer.getGender())
                .ageGroup(customer.getAgeGroup())
                .prefecture(customer.getPrefecture())
                .city(customer.getCity())
                .membershipTier(customer.getMembershipTier())
                .joinedDate(customer.getJoinedDate())
                .status(customer.getStatus())
                .createdAt(customer.getCreatedAt())
                .updatedAt(customer.getUpdatedAt())
                .build();
    }
}
