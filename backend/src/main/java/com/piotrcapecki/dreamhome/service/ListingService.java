package com.piotrcapecki.dreamhome.service;

import com.piotrcapecki.dreamhome.dto.request.ListingRequest;
import com.piotrcapecki.dreamhome.dto.response.ListingResponse;
import com.piotrcapecki.dreamhome.dto.response.UserResponse;
import com.piotrcapecki.dreamhome.entity.*;
import com.piotrcapecki.dreamhome.enums.ListingStatus;
import com.piotrcapecki.dreamhome.enums.Role;
import com.piotrcapecki.dreamhome.exception.ResourceNotFoundException;
import com.piotrcapecki.dreamhome.repository.CategoryRepository;
import com.piotrcapecki.dreamhome.repository.ListingRepository;
import com.piotrcapecki.dreamhome.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ListingService {

    private final ListingRepository listingRepository;
    private final CategoryRepository categoryRepository;
    private final LocationRepository locationRepository;
    private final UserService userService;

    public ListingResponse createListing(ListingRequest request) {
        User currentUser = userService.getCurrentUser();
        if (currentUser.getRole() == Role.USER) {
            throw new IllegalArgumentException("Only AGENTs and ADMINs can create listings");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        Location location = locationRepository.findById(request.getLocationId())
                .orElseThrow(() -> new ResourceNotFoundException("Location not found"));

        Listing listing = Listing.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .area(request.getArea())
                .rooms(request.getRooms())
                .floor(request.getFloor())
                .type(request.getType())
                .status(ListingStatus.ACTIVE)
                .user(currentUser)
                .category(category)
                .location(location)
                .images(new ArrayList<>())
                .build();

        if (request.getImageUrls() != null) {
            List<ListingImage> images = new ArrayList<>();
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                String url = request.getImageUrls().get(i);
                images.add(ListingImage.builder()
                        .listing(listing)
                        .imageUrl(url)
                        .isPrimary(i == 0) // First image is primary
                        .sortOrder(i)
                        .build());
            }
            listing.setImages(images);
        }

        Listing savedListing = listingRepository.save(listing);
        return mapToResponse(savedListing);
    }

    public List<ListingResponse> getAllListings() {
        // Can add filters here later
        return listingRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ListingResponse getListingById(Long id) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found with id: " + id));
        return mapToResponse(listing);
    }

    public void deleteListing(Long id) {
        User currentUser = userService.getCurrentUser();
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found"));

        if (!listing.getUser().getId().equals(currentUser.getId()) && currentUser.getRole() != Role.ADMIN) {
            throw new IllegalArgumentException("You do not have permission to delete this listing");
        }
        listingRepository.delete(listing);
    }

    private ListingResponse mapToResponse(Listing listing) {
        List<String> images = listing.getImages().stream()
                .map(ListingImage::getImageUrl)
                .collect(Collectors.toList());

        String primaryImage = listing.getImages().stream()
                .filter(img -> Boolean.TRUE.equals(img.getIsPrimary()))
                .map(ListingImage::getImageUrl)
                .findFirst()
                .orElse(images.isEmpty() ? null : images.get(0));

        UserResponse userResponse = UserResponse.builder()
                .id(listing.getUser().getId())
                .email(listing.getUser().getEmail())
                .firstName(listing.getUser().getFirstName())
                .lastName(listing.getUser().getLastName())
                .phone(listing.getUser().getPhone())
                .avatarUrl(listing.getUser().getAvatarUrl())
                .agencyName(listing.getUser().getAgencyName())
                .role(listing.getUser().getRole().name())
                .createdAt(listing.getUser().getCreatedAt())
                .build();

        return ListingResponse.builder()
                .id(listing.getId())
                .title(listing.getTitle())
                .description(listing.getDescription())
                .price(listing.getPrice())
                .area(listing.getArea())
                .rooms(listing.getRooms())
                .floor(listing.getFloor())
                .type(listing.getType())
                .status(listing.getStatus())
                .user(userResponse)
                .category(listing.getCategory().getName())
                .city(listing.getLocation().getCity())
                .district(listing.getLocation().getDistrict())
                .primaryImage(primaryImage)
                .images(images)
                .createdAt(listing.getCreatedAt())
                .build();
    }
}
