package com.piotrcapecki.dreamhome.dto.request;

import com.piotrcapecki.dreamhome.enums.ListingType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ListingFilterDTO {
    private Long categoryId;
    private String categoryName; // For text search by category name
    private Long locationId;
    private String city; // Added for text search by city name
    private ListingType type;
    private BigDecimal priceMin;
    private BigDecimal priceMax;
    private BigDecimal minArea;
    private BigDecimal maxArea;
    private Integer minRooms;
    private Integer maxRooms;
}
