package com.piotrcapecki.dreamhome.repository;

import com.piotrcapecki.dreamhome.entity.ListingImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ListingImageRepository extends JpaRepository<ListingImage, Long> {
}
