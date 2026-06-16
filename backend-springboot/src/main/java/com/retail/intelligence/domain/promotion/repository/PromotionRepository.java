package com.retail.intelligence.domain.promotion.repository;

import com.retail.intelligence.common.enums.PromotionStatus;
import com.retail.intelligence.domain.promotion.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PromotionRepository extends JpaRepository<Promotion, UUID> {

    Optional<Promotion> findByPromotionCode(String promotionCode);

    List<Promotion> findByStatus(PromotionStatus status);
}
