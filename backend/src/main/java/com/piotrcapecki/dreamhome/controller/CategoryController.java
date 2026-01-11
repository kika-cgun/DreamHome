package com.piotrcapecki.dreamhome.controller;

import com.piotrcapecki.dreamhome.entity.Category;
import com.piotrcapecki.dreamhome.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    // Creating categories -> ADMIN only, secured by logic or later endpoint
    // security
    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        // Validation could be added
        return ResponseEntity.ok(categoryService.createCategory(category));
    }
}
