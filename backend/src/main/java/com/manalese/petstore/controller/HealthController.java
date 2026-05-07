package com.manalese.petstore.controller;

import com.manalese.petstore.dto.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

/**
 * Health Check Controller
 * 
 * Provides endpoint for monitoring service health and readiness.
 * Used by Render monitoring and load balancers.
 */
@RestController
@RequestMapping("/health")
public class HealthController {

    @GetMapping
    public ApiResponse<Map<String, String>> health() {
        Map<String, String> healthStatus = new HashMap<>();
        healthStatus.put("status", "UP");
        healthStatus.put("service", "petstore-api");
        healthStatus.put("version", "1.0.0");
        
        return ApiResponse.success(healthStatus, "Service is healthy");
    }

    @GetMapping("/ready")
    public ApiResponse<Map<String, String>> ready() {
        Map<String, String> readyStatus = new HashMap<>();
        readyStatus.put("ready", "true");
        readyStatus.put("timestamp", System.currentTimeMillis() + "");
        
        return ApiResponse.success(readyStatus, "Service is ready");
    }
}
