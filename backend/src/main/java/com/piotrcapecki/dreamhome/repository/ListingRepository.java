package com.piotrcapecki.dreamhome.repository;

import com.piotrcapecki.dreamhome.entity.Listing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ListingRepository extends JpaRepository<Listing, Long> {
    List<Listing> findByUserId(Long userId);
    // Filters can be added later using Specifications or QueryDSL
}
