package com.retail.intelligence.domain.customer.repository;

import com.retail.intelligence.common.enums.CustomerStatus;
import com.retail.intelligence.domain.customer.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CustomerRepository extends JpaRepository<Customer, UUID> {

    Optional<Customer> findByCustomerCode(String customerCode);

    List<Customer> findByStatus(CustomerStatus status);
}
