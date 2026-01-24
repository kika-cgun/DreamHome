package com.piotrcapecki.dreamhome.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @Autowired
    private DataSource dataSource;

    /**
     * Basic health check - returns OK if the application is running
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "DreamHome Java Backend");
        response.put("timestamp", Instant.now().toString());
        return ResponseEntity.ok(response);
    }

    /**
     * Detailed health check - checks database connectivity
     */
    @GetMapping("/health/details")
    public ResponseEntity<Map<String, Object>> healthDetails() {
        Map<String, Object> response = new HashMap<>();
        Map<String, Object> checks = new HashMap<>();

        // Application check
        Map<String, String> appCheck = new HashMap<>();
        appCheck.put("status", "UP");
        checks.put("application", appCheck);

        // Database check
        checks.put("database", checkDatabase());

        boolean allUp = true;
        for (Object check : checks.values()) {
            @SuppressWarnings("unchecked")
            Map<String, Object> checkMap = (Map<String, Object>) check;
            if (!"UP".equals(checkMap.get("status"))) {
                allUp = false;
                break;
            }
        }

        response.put("status", allUp ? "UP" : "DOWN");
        response.put("service", "DreamHome Java Backend");
        response.put("timestamp", Instant.now().toString());
        response.put("checks", checks);

        return allUp ? ResponseEntity.ok(response) : ResponseEntity.status(503).body(response);
    }

    private Map<String, Object> checkDatabase() {
        Map<String, Object> dbCheck = new HashMap<>();
        try (Connection connection = dataSource.getConnection()) {
            dbCheck.put("status", "UP");
            dbCheck.put("database", connection.getCatalog());
        } catch (Exception e) {
            dbCheck.put("status", "DOWN");
            dbCheck.put("error", e.getMessage());
        }
        return dbCheck;
    }
}
