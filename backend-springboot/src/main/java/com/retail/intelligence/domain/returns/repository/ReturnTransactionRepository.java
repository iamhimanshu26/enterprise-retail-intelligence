package com.retail.intelligence.domain.returns.repository;

import com.retail.intelligence.common.enums.ReturnStatus;
import com.retail.intelligence.domain.returns.entity.ReturnTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReturnTransactionRepository extends JpaRepository<ReturnTransaction, UUID> {

    Optional<ReturnTransaction> findByReturnCode(String returnCode);

    List<ReturnTransaction> findByStatus(ReturnStatus status);
}
