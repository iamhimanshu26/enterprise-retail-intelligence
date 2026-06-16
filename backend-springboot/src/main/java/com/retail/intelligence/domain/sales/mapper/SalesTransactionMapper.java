package com.retail.intelligence.domain.sales.mapper;

import com.retail.intelligence.domain.sales.dto.SalesTransactionResponse;
import com.retail.intelligence.domain.sales.entity.SalesTransaction;
import org.springframework.stereotype.Component;

@Component
public class SalesTransactionMapper {

    public SalesTransactionResponse toResponse(SalesTransaction transaction) {
        return SalesTransactionResponse.builder()
                .id(transaction.getId())
                .transactionCode(transaction.getTransactionCode())
                .storeId(transaction.getStore() != null ? transaction.getStore().getId() : null)
                .customerId(transaction.getCustomer() != null ? transaction.getCustomer().getId() : null)
                .transactionDate(transaction.getTransactionDate())
                .paymentMethod(transaction.getPaymentMethod())
                .totalAmount(transaction.getTotalAmount())
                .totalCost(transaction.getTotalCost())
                .grossProfit(transaction.getGrossProfit())
                .discountAmount(transaction.getDiscountAmount())
                .taxAmount(transaction.getTaxAmount())
                .transactionStatus(transaction.getTransactionStatus())
                .createdAt(transaction.getCreatedAt())
                .updatedAt(transaction.getUpdatedAt())
                .build();
    }
}
