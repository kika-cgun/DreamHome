package com.piotrcapecki.dreamhome.config;

import com.piotrcapecki.dreamhome.entity.*;
import com.piotrcapecki.dreamhome.enums.ListingStatus;
import com.piotrcapecki.dreamhome.enums.ListingType;
import com.piotrcapecki.dreamhome.enums.Role;
import com.piotrcapecki.dreamhome.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final LocationRepository locationRepository;
    private final ListingRepository listingRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            seedUsers();
        }
        if (categoryRepository.count() == 0) {
            seedCategories();
        }
        if (locationRepository.count() == 0) {
            seedLocations();
        }
        if (listingRepository.count() == 0) {
            seedListings();
        }
    }

    private void seedUsers() {
        User admin = User.builder()
                .email("admin@dreamhome.com")
                .password(passwordEncoder.encode("admin123"))
                .firstName("Admin")
                .lastName("System")
                .role(Role.ADMIN)
                .build();

        User agent = User.builder()
                .email("agent@dreamhome.com")
                .password(passwordEncoder.encode("agent123"))
                .firstName("James")
                .lastName("Bond")
                .phone("007007007")
                .role(Role.AGENT)
                .agencyName("MI6 Real Estate")
                .build();

        User user = User.builder()
                .email("user@dreamhome.com")
                .password(passwordEncoder.encode("user123"))
                .firstName("John")
                .lastName("Doe")
                .phone("123456789")
                .role(Role.USER)
                .build();

        userRepository.saveAll(List.of(admin, agent, user));
        System.out.println("Users seeded");
    }

    private void seedCategories() {
        Category apartment = Category.builder().name("Apartment").description("Flats and apartments").build();
        Category house = Category.builder().name("House").description("Detached houses and villas").build();
        Category office = Category.builder().name("Office").description("Office spaces").build();
        Category land = Category.builder().name("Land").description("Construction lands").build();

        categoryRepository.saveAll(List.of(apartment, house, office, land));
        System.out.println("Categories seeded");
    }

    private void seedLocations() {
        Location varsaw = Location.builder().city("Warsaw").district("Mokotow").build();
        Location krakow = Location.builder().city("Krakow").district("Stare Miasto").build();
        Location gdansk = Location.builder().city("Gdansk").district("Wrzeszcz").build();

        locationRepository.saveAll(List.of(varsaw, krakow, gdansk));
        System.out.println("Locations seeded");
    }

    private void seedListings() {
        User agent = userRepository.findByEmail("agent@dreamhome.com").orElseThrow();
        Category apartment = categoryRepository.findByName("Apartment").orElseThrow();
        Location warsaw = locationRepository.findAll().stream().filter(l -> l.getCity().equals("Warsaw")).findFirst()
                .orElseThrow();

        Listing listing1 = Listing.builder()
                .title("Luxury Apartment in Warsaw")
                .description("Beautiful apartment with city view")
                .price(BigDecimal.valueOf(1500000))
                .area(BigDecimal.valueOf(85.5))
                .rooms(3)
                .floor("5")
                .type(ListingType.SALE)
                .status(ListingStatus.ACTIVE)
                .user(agent)
                .category(apartment)
                .location(warsaw)
                .build();

        // Add image to listing1
        ListingImage img1 = ListingImage.builder()
                .listing(listing1)
                .imageUrl("https://images.unsplash.com/photo-1522708323590-d24dbb6b0267")
                .isPrimary(true)
                .sortOrder(0)
                .build();
        listing1.setImages(List.of(img1));

        listingRepository.save(listing1);
        System.out.println("Listings seeded");
    }
}
