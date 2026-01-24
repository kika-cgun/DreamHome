package com.piotrcapecki.dreamhome.controller;

import com.piotrcapecki.dreamhome.dto.request.ListingFilterDTO;
import com.piotrcapecki.dreamhome.dto.request.ListingRequest;
import com.piotrcapecki.dreamhome.dto.response.ListingResponse;
import com.piotrcapecki.dreamhome.enums.ListingType;
import com.piotrcapecki.dreamhome.service.ListingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/listings")
@RequiredArgsConstructor
public class ListingController {

    private final ListingService listingService;

    @GetMapping
    public ResponseEntity<List<ListingResponse>> getAllListings(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Long locationId,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) ListingType type,
            @RequestParam(required = false) BigDecimal priceMin,
            @RequestParam(required = false) BigDecimal priceMax,
            @RequestParam(required = false) BigDecimal minArea,
            @RequestParam(required = false) BigDecimal maxArea,
            @RequestParam(required = false) Integer minRooms,
            @RequestParam(required = false) Integer maxRooms) {
        ListingFilterDTO filters = ListingFilterDTO.builder()
                .categoryId(categoryId)
                .categoryName(category)
                .locationId(locationId)
                .city(city)
                .type(type)
                .priceMin(priceMin)
                .priceMax(priceMax)
                .minArea(minArea)
                .maxArea(maxArea)
                .minRooms(minRooms)
                .maxRooms(maxRooms)
                .build();
        return ResponseEntity.ok(listingService.getAllListings(filters));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ListingResponse> getListing(@PathVariable Long id) {
        return ResponseEntity.ok(listingService.getListingById(id));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ListingResponse>> getMyListings() {
        return ResponseEntity.ok(listingService.getMyListings());
    }

    @GetMapping("/city-counts")
    public ResponseEntity<List<java.util.Map<String, Object>>> getCityCounts() {
        return ResponseEntity.ok(listingService.getCityCounts());
    }

    @PostMapping
    public ResponseEntity<ListingResponse> createListing(@Valid @RequestBody ListingRequest request) {
        return ResponseEntity.ok(listingService.createListing(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ListingResponse> updateListing(
            @PathVariable Long id,
            @Valid @RequestBody ListingRequest request) {
        return ResponseEntity.ok(listingService.updateListing(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteListing(@PathVariable Long id) {
        listingService.deleteListing(id);
        return ResponseEntity.noContent().build();
    }
}
