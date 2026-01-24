package com.piotrcapecki.dreamhome.repository;

import com.piotrcapecki.dreamhome.entity.Listing;
import com.piotrcapecki.dreamhome.enums.ListingType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ListingRepository extends JpaRepository<Listing, Long> {
        List<Listing> findByUserId(Long userId);

        @Query("SELECT l FROM Listing l LEFT JOIN l.location loc WHERE " +
                        "(:categoryId IS NULL OR l.category.id = :categoryId) AND " +
                        "(:categoryName IS NULL OR LOWER(CAST(l.category.name AS string)) LIKE LOWER(CONCAT('%', COALESCE(CAST(:categoryName AS string), ''), '%'))) AND "
                        +
                        "(:locationId IS NULL OR loc.id = :locationId) AND " +
                        "(:city IS NULL OR LOWER(CAST(l.city AS string)) LIKE LOWER(CONCAT('%', COALESCE(CAST(:city AS string), ''), '%')) OR (loc IS NOT NULL AND LOWER(CAST(loc.city AS string)) LIKE LOWER(CONCAT('%', COALESCE(CAST(:city AS string), ''), '%')))) AND "
                        +
                        "(:type IS NULL OR l.type = :type) AND " +
                        "(:priceMin IS NULL OR l.price >= :priceMin) AND " +
                        "(:priceMax IS NULL OR l.price <= :priceMax) AND " +
                        "(:minArea IS NULL OR l.area >= :minArea) AND " +
                        "(:maxArea IS NULL OR l.area <= :maxArea) AND " +
                        "(:minRooms IS NULL OR l.rooms >= :minRooms) AND " +
                        "(:maxRooms IS NULL OR l.rooms <= :maxRooms) AND " +
                        "l.status = 'ACTIVE'")
        List<Listing> findWithFilters(
                        @Param("categoryId") Long categoryId,
                        @Param("categoryName") String categoryName,
                        @Param("locationId") Long locationId,
                        @Param("city") String city,
                        @Param("type") ListingType type,
                        @Param("priceMin") BigDecimal priceMin,
                        @Param("priceMax") BigDecimal priceMax,
                        @Param("minArea") BigDecimal minArea,
                        @Param("maxArea") BigDecimal maxArea,
                        @Param("minRooms") Integer minRooms,
                        @Param("maxRooms") Integer maxRooms);
}
