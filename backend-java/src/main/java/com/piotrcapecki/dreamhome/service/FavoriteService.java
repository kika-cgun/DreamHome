package com.piotrcapecki.dreamhome.service;

import com.piotrcapecki.dreamhome.dto.response.ListingResponse;
import com.piotrcapecki.dreamhome.entity.Favorite;
import com.piotrcapecki.dreamhome.entity.Listing;
import com.piotrcapecki.dreamhome.entity.ListingImage;
import com.piotrcapecki.dreamhome.entity.User;
import com.piotrcapecki.dreamhome.exception.ResourceNotFoundException;
import com.piotrcapecki.dreamhome.repository.FavoriteRepository;
import com.piotrcapecki.dreamhome.repository.ListingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final ListingRepository listingRepository;
    private final UserService userService;

    public void addFavorite(Long listingId) {
        User currentUser = userService.getCurrentUser();
        if (favoriteRepository.existsByUserIdAndListingId(currentUser.getId(), listingId)) {
            return; // Already favorite, idempotent
        }
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found"));

        Favorite favorite = Favorite.builder()
                .user(currentUser)
                .listing(listing)
                .build();
        favoriteRepository.save(favorite);
    }

    public void removeFavorite(Long listingId) {
        User currentUser = userService.getCurrentUser();
        Favorite favorite = favoriteRepository.findByUserIdAndListingId(currentUser.getId(), listingId)
                .orElseThrow(() -> new ResourceNotFoundException("Favorite not found"));
        favoriteRepository.delete(favorite);
    }

    public List<ListingResponse> getMyFavorites() {
        User currentUser = userService.getCurrentUser();
        return favoriteRepository.findByUserId(currentUser.getId()).stream()
                .map(fav -> mapListingToResponse(fav.getListing()))
                .collect(Collectors.toList());
    }

    // Duplicate mapping logic, normally I'd use a Mapper class or inject
    // ListingService
    // For now, let's keep it simple here, or even better, delegate to
    // ListingService if possible?
    // Circular dependency risk if I inject ListingService which injects
    // UserService...
    // Let's just reproduce simple mapping or use a minimal mapper.
    // I'll copy minimal mapping here.
    private ListingResponse mapListingToResponse(Listing listing) {
        List<String> images = listing.getImages().stream()
                .map(ListingImage::getImageUrl)
                .collect(Collectors.toList());

        String primaryImage = listing.getImages().stream()
                .filter(img -> Boolean.TRUE.equals(img.getIsPrimary()))
                .map(ListingImage::getImageUrl)
                .findFirst()
                .orElse(images.isEmpty() ? null : images.get(0));

        return ListingResponse.builder()
                .id(listing.getId())
                .title(listing.getTitle())
                .price(listing.getPrice())
                .primaryImage(primaryImage)
                // Minimal data for favorites list usually
                .build();
    }
}
