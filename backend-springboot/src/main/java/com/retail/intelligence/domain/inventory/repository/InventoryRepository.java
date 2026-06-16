package com.retail.intelligence.domain.inventory.repository;

import com.retail.intelligence.common.enums.StockStatus;
import com.retail.intelligence.domain.inventory.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface InventoryRepository extends JpaRepository<Inventory, UUID> {

    List<Inventory> findByStockStatus(StockStatus stockStatus);
}
