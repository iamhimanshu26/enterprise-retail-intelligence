package com.retail.intelligence.domain.inventory.entity;

import com.retail.intelligence.common.entity.BaseEntity;
import com.retail.intelligence.common.enums.StockStatus;
import com.retail.intelligence.domain.product.entity.Product;
import com.retail.intelligence.domain.store.entity.Store;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "inventory", schema = "retail")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inventory extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "quantity_on_hand", nullable = false)
    private Integer quantityOnHand;

    @Column(name = "reorder_level", nullable = false)
    private Integer reorderLevel;

    @Column(name = "reorder_quantity", nullable = false)
    private Integer reorderQuantity;

    @Enumerated(EnumType.STRING)
    @Column(name = "stock_status", nullable = false, length = 50)
    private StockStatus stockStatus;

    @Column(name = "last_restocked_at")
    private Instant lastRestockedAt;
}
