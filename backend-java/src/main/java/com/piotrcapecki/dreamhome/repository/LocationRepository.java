package com.piotrcapecki.dreamhome.repository;

import com.piotrcapecki.dreamhome.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {

    /**
     * Find location by city name (case-insensitive)
     * Used for normalizing city names across listings
     */
    Optional<Location> findByCityIgnoreCase(String city);
}
