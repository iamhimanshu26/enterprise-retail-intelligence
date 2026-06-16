package com.retail.intelligence.domain.store.repository;

import com.retail.intelligence.common.enums.Region;
import com.retail.intelligence.common.enums.StoreStatus;
import com.retail.intelligence.common.enums.StoreType;
import com.retail.intelligence.domain.store.entity.Store;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@EnableJpaAuditing
class StoreRepositoryTest {

    @Autowired
    private StoreRepository storeRepository;

    @Test
    void savesAndFindsStoreByCode() {
        Store store = Store.builder()
                .storeCode("JP-TYO-001")
                .storeName("Tokyo Flagship")
                .region(Region.KANTO)
                .prefecture("Tokyo")
                .city("Shibuya")
                .address("1-1 Retail Way")
                .storeType(StoreType.FLAGSHIP)
                .openingDate(LocalDate.of(2020, 4, 1))
                .status(StoreStatus.ACTIVE)
                .build();

        storeRepository.save(store);

        assertThat(storeRepository.findByStoreCode("JP-TYO-001"))
                .isPresent()
                .get()
                .extracting(Store::getStoreName)
                .isEqualTo("Tokyo Flagship");
    }
}
