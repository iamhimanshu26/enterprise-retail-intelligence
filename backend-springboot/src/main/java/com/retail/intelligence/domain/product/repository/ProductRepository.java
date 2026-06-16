package com.retail.intelligence.domain.product.repository;

import com.retail.intelligence.common.enums.ProductStatus;
import com.retail.intelligence.domain.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {

    Optional<Product> findByProductCode(String productCode);

    List<Product> findByCategory(String category);

    List<Product> findByStatus(ProductStatus status);
}
