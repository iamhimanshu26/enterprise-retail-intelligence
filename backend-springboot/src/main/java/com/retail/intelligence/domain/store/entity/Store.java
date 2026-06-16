package com.retail.intelligence.domain.store.entity;

import com.retail.intelligence.common.entity.BaseEntity;
import com.retail.intelligence.common.enums.Region;
import com.retail.intelligence.common.enums.StoreStatus;
import com.retail.intelligence.common.enums.StoreType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "stores", schema = "retail")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Store extends BaseEntity {

    @Column(name = "store_code", nullable = false, unique = true, length = 50)
    private String storeCode;

    @Column(name = "store_name", nullable = false)
    private String storeName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private Region region;

    @Column(nullable = false, length = 100)
    private String prefecture;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(nullable = false, length = 500)
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(name = "store_type", nullable = false, length = 50)
    private StoreType storeType;

    @Column(name = "opening_date", nullable = false)
    private LocalDate openingDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private StoreStatus status;
}
