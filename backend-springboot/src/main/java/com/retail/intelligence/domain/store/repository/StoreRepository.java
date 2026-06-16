package com.retail.intelligence.domain.store.repository;

import com.retail.intelligence.common.enums.Region;
import com.retail.intelligence.common.enums.StoreStatus;
import com.retail.intelligence.domain.store.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface StoreRepository extends JpaRepository<Store, UUID> {

    Optional<Store> findByStoreCode(String storeCode);

    List<Store> findByRegion(Region region);

    List<Store> findByStatus(StoreStatus status);
}
