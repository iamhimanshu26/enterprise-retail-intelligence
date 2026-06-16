package com.retail.intelligence.domain.supplier.service;

import com.retail.intelligence.common.dto.DomainReadinessResponse;
import com.retail.intelligence.domain.supplier.dto.SupplierResponse;
import com.retail.intelligence.domain.supplier.mapper.SupplierMapper;
import com.retail.intelligence.domain.supplier.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierService {

    private static final String DOMAIN = "supplier";
    private static final String READINESS_MESSAGE = "domain model configured. Full CRUD APIs arrive in Phase 3.";

    private final SupplierRepository supplierRepository;
    private final SupplierMapper supplierMapper;

    public DomainReadinessResponse readiness() {
        return DomainReadinessResponse.builder()
                .domain(DOMAIN)
                .status("READY")
                .message(READINESS_MESSAGE)
                .recordCount(supplierRepository.count())
                .build();
    }

    public List<SupplierResponse> listSuppliers() {
        return supplierRepository.findAll().stream()
                .map(supplierMapper::toResponse)
                .toList();
    }
}
