package com.piotrcapecki.dreamhome.service;

import com.piotrcapecki.dreamhome.entity.Location;
import com.piotrcapecki.dreamhome.exception.ResourceNotFoundException;
import com.piotrcapecki.dreamhome.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LocationService {

    private final LocationRepository locationRepository;

    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }

    /**
     * Find existing location by city name (case-insensitive) or create new one
     * Used for normalizing city names when creating listings
     */
    public Location findOrCreateByName(String cityName) {
        if (cityName == null || cityName.trim().isEmpty()) {
            return null;
        }
        String normalizedCity = capitalizeCity(cityName.trim());
        return locationRepository.findByCityIgnoreCase(normalizedCity)
                .orElseGet(() -> locationRepository.save(
                        Location.builder().city(normalizedCity).build()));
    }

    /**
     * Find location by city name (case-insensitive)
     */
    public Optional<Location> findByCityName(String cityName) {
        if (cityName == null || cityName.trim().isEmpty()) {
            return Optional.empty();
        }
        return locationRepository.findByCityIgnoreCase(cityName.trim());
    }

    public Location createLocation(Location location) {
        // Normalize city name before saving
        location.setCity(capitalizeCity(location.getCity().trim()));
        return locationRepository.save(location);
    }

    public Location updateLocation(Long id, Location locationDetails) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Location not found with id: " + id));

        location.setCity(capitalizeCity(locationDetails.getCity().trim()));
        location.setDistrict(locationDetails.getDistrict());
        location.setImageUrl(locationDetails.getImageUrl());
        return locationRepository.save(location);
    }

    public void deleteLocation(Long id) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Location not found with id: " + id));
        locationRepository.delete(location);
    }

    /**
     * Capitalize city name: first letter uppercase, rest lowercase
     * e.g., "gdynia" -> "Gdynia", "WARSZAWA" -> "Warszawa"
     */
    private String capitalizeCity(String city) {
        if (city == null || city.isEmpty()) {
            return city;
        }
        return city.substring(0, 1).toUpperCase() + city.substring(1).toLowerCase();
    }
}
