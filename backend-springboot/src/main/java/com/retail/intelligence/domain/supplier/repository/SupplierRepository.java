package com.retail.intelligence.domain.supplier.repository;

import com.retail.intelligence.common.enums.Region;
import com.retail.intelligence.common.enums.SupplierStatus;
import com.retail.intelligence.domain.supplier.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SupplierRepository extends JpaRepository<Supplier, UUID> {

    Optional<Supplier> findBySupplierCode(String supplierCode);

    List<Supplier> findByRegion(Region region);

    List<Supplier> findByStatus(SupplierStatus status);
}
