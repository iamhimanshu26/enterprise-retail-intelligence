package com.retail.intelligence.domain.sales.repository;

import com.retail.intelligence.common.enums.TransactionStatus;
import com.retail.intelligence.domain.sales.entity.SalesTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SalesTransactionRepository extends JpaRepository<SalesTransaction, UUID> {

    Optional<SalesTransaction> findByTransactionCode(String transactionCode);

    List<SalesTransaction> findByTransactionStatus(TransactionStatus transactionStatus);
}
