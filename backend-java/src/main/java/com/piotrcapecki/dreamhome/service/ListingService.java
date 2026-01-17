package com.piotrcapecki.dreamhome.service;

import com.piotrcapecki.dreamhome.dto.request.ListingFilterDTO;
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

        public List<ListingResponse> getAllListings(ListingFilterDTO filters) {
                List<Listing> listings;

                if (filters == null || isFilterEmpty(filters)) {
                        // No filters - return all listings
                        listings = listingRepository.findAll();
                } else {
                        // Use filters
                        listings = listingRepository.findWithFilters(
                                        filters.getCategoryId(),
                                        filters.getLocationId(),
                                        filters.getCity(), // Added city parameter
                                        filters.getType(),
                                        filters.getPriceMin(),
                                        filters.getPriceMax(),
                                        filters.getMinArea(),
                                        filters.getMaxArea(),
                                        filters.getMinRooms(),
                                        filters.getMaxRooms());
                }

                return listings.stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
        }

        private boolean isFilterEmpty(ListingFilterDTO filters) {
                return filters.getCategoryId() == null &&
                                filters.getLocationId() == null &&
                                filters.getCity() == null && // Added city check
                                filters.getType() == null &&
                                filters.getPriceMin() == null &&
                                filters.getPriceMax() == null &&
                                filters.getMinArea() == null &&
                                filters.getMaxArea() == null &&
                                filters.getMinRooms() == null &&
                                filters.getMaxRooms() == null;
        }

        public ListingResponse getListingById(Long id) {
                Listing listing = listingRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Listing not found with id: " + id));
                return mapToResponse(listing);
        }

        public List<ListingResponse> getMyListings() {
                User currentUser = userService.getCurrentUser();
                return listingRepository.findByUserId(currentUser.getId()).stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
        }

        public ListingResponse updateListing(Long id, ListingRequest request) {
                User currentUser = userService.getCurrentUser();
                Listing listing = listingRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Listing not found with id: " + id));

                // Check permissions - only owner or ADMIN can update
                if (!listing.getUser().getId().equals(currentUser.getId()) && currentUser.getRole() != Role.ADMIN) {
                        throw new IllegalArgumentException("You do not have permission to update this listing");
                }

                // Update category and location if changed
                if (request.getCategoryId() != null && !request.getCategoryId().equals(listing.getCategory().getId())) {
                        Category category = categoryRepository.findById(request.getCategoryId())
                                        .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
                        listing.setCategory(category);
                }

                if (request.getLocationId() != null && !request.getLocationId().equals(listing.getLocation().getId())) {
                        Location location = locationRepository.findById(request.getLocationId())
                                        .orElseThrow(() -> new ResourceNotFoundException("Location not found"));
                        listing.setLocation(location);
                }

                // Update basic fields
                if (request.getTitle() != null)
                        listing.setTitle(request.getTitle());
                if (request.getDescription() != null)
                        listing.setDescription(request.getDescription());
                if (request.getPrice() != null)
                        listing.setPrice(request.getPrice());
                if (request.getArea() != null)
                        listing.setArea(request.getArea());
                if (request.getRooms() != null)
                        listing.setRooms(request.getRooms());
                if (request.getFloor() != null)
                        listing.setFloor(request.getFloor());
                if (request.getType() != null)
                        listing.setType(request.getType());

                // Update images if provided
                if (request.getImageUrls() != null) {
                        listing.getImages().clear();
                        List<ListingImage> newImages = new ArrayList<>();
                        for (int i = 0; i < request.getImageUrls().size(); i++) {
                                String url = request.getImageUrls().get(i);
                                newImages.add(ListingImage.builder()
                                                .listing(listing)
                                                .imageUrl(url)
                                                .isPrimary(i == 0)
                                                .sortOrder(i)
                                                .build());
                        }
                        listing.setImages(newImages);
                }

                Listing updatedListing = listingRepository.save(listing);
                return mapToResponse(updatedListing);
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
