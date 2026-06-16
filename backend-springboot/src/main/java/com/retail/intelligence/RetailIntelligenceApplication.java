package com.retail.intelligence;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class RetailIntelligenceApplication {

    public static void main(String[] args) {
        SpringApplication.run(RetailIntelligenceApplication.class, args);
    }
}
