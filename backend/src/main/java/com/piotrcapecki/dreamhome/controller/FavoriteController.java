package com.piotrcapecki.dreamhome.controller;

import com.piotrcapecki.dreamhome.dto.response.ListingResponse;
import com.piotrcapecki.dreamhome.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @GetMapping
    public ResponseEntity<List<ListingResponse>> getMyFavorites() {
        return ResponseEntity.ok(favoriteService.getMyFavorites());
    }

    @PostMapping("/{listingId}")
    public ResponseEntity<Void> addFavorite(@PathVariable Long listingId) {
        favoriteService.addFavorite(listingId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{listingId}")
    public ResponseEntity<Void> removeFavorite(@PathVariable Long listingId) {
        favoriteService.removeFavorite(listingId);
        return ResponseEntity.noContent().build();
    }
}
