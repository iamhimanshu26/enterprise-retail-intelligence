package com.retail.intelligence.domain.customer.service;

import com.retail.intelligence.common.dto.DomainReadinessResponse;
import com.retail.intelligence.domain.customer.dto.CustomerResponse;
import com.retail.intelligence.domain.customer.mapper.CustomerMapper;
import com.retail.intelligence.domain.customer.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private static final String DOMAIN = "customer";
    private static final String READINESS_MESSAGE = "domain model configured. Full CRUD APIs arrive in Phase 3.";

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    public DomainReadinessResponse readiness() {
        return DomainReadinessResponse.builder()
                .domain(DOMAIN)
                .status("READY")
                .message(READINESS_MESSAGE)
                .recordCount(customerRepository.count())
                .build();
    }

    public List<CustomerResponse> listCustomers() {
        return customerRepository.findAll().stream()
                .map(customerMapper::toResponse)
                .toList();
    }
}
