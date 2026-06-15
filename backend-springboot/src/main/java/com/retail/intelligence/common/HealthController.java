package com.retail.intelligence.common;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class HealthController {

    private static final String SERVICE_NAME = "retail-intelligence-backend";
    private static final String VERSION = "0.1.0-SNAPSHOT";

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<HealthResponse>> health() {
        HealthResponse health = HealthResponse.builder()
                .status("UP")
                .service(SERVICE_NAME)
                .version(VERSION)
                .build();
        return ResponseEntity.ok(ApiResponse.success(health));
    }
}
