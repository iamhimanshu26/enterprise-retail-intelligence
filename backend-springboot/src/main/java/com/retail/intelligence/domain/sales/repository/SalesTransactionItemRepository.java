package com.retail.intelligence.domain.sales.repository;

import com.retail.intelligence.domain.sales.entity.SalesTransactionItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SalesTransactionItemRepository extends JpaRepository<SalesTransactionItem, UUID> {

    List<SalesTransactionItem> findBySalesTransaction_Id(UUID salesTransactionId);
}
