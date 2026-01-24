package com.piotrcapecki.dreamhome.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Controller to serve files from PHP storage path for backwards compatibility.
 * This allows Java backend to serve images uploaded via PHP backend.
 */
@RestController
@RequestMapping("/storage/uploads")
public class StorageController {

    // Path to PHP storage uploads - relative to project root
    private static final String PHP_STORAGE_PATH = "../backend-php/storage/app/public/uploads";

    @GetMapping("/{filename}")
    public ResponseEntity<byte[]> getStorageImage(@PathVariable String filename) {
        try {
            // First try PHP storage path
            Path phpPath = Paths.get(PHP_STORAGE_PATH).resolve(filename);
            if (Files.exists(phpPath)) {
                byte[] imageBytes = Files.readAllBytes(phpPath);
                String contentType = Files.probeContentType(phpPath);
                return ResponseEntity.ok()
                        .header("Content-Type", contentType != null ? contentType : "image/jpeg")
                        .body(imageBytes);
            }

            // Try Java uploads directory as fallback
            Path javaPath = Paths.get("uploads").resolve(filename);
            if (Files.exists(javaPath)) {
                byte[] imageBytes = Files.readAllBytes(javaPath);
                String contentType = Files.probeContentType(javaPath);
                return ResponseEntity.ok()
                        .header("Content-Type", contentType != null ? contentType : "image/jpeg")
                        .body(imageBytes);
            }

            return ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
