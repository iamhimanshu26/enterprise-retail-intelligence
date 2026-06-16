package com.retail.intelligence.domain.returns.mapper;

import com.retail.intelligence.domain.returns.dto.ReturnTransactionResponse;
import com.retail.intelligence.domain.returns.entity.ReturnTransaction;
import org.springframework.stereotype.Component;

@Component
public class ReturnTransactionMapper {

    public ReturnTransactionResponse toResponse(ReturnTransaction returnTransaction) {
        return ReturnTransactionResponse.builder()
                .id(returnTransaction.getId())
                .returnCode(returnTransaction.getReturnCode())
                .salesTransactionId(returnTransaction.getSalesTransaction() != null
                        ? returnTransaction.getSalesTransaction().getId() : null)
                .productId(returnTransaction.getProduct() != null ? returnTransaction.getProduct().getId() : null)
                .storeId(returnTransaction.getStore() != null ? returnTransaction.getStore().getId() : null)
                .customerId(returnTransaction.getCustomer() != null ? returnTransaction.getCustomer().getId() : null)
                .returnDate(returnTransaction.getReturnDate())
                .quantity(returnTransaction.getQuantity())
                .refundAmount(returnTransaction.getRefundAmount())
                .reason(returnTransaction.getReason())
                .status(returnTransaction.getStatus())
                .createdAt(returnTransaction.getCreatedAt())
                .updatedAt(returnTransaction.getUpdatedAt())
                .build();
    }
}
