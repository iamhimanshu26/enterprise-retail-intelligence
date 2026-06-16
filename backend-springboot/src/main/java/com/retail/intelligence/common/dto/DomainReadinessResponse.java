package com.retail.intelligence.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DomainReadinessResponse {

    private String domain;
    private String status;
    private String message;
    private long recordCount;
}
