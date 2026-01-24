package com.piotrcapecki.dreamhome.dto.request;

import com.piotrcapecki.dreamhome.enums.ListingType;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ListingRequest {

    private String title;

    private String description;

    private BigDecimal price;

    private BigDecimal area;

    private Integer rooms;
    private String floor;

    private ListingType type;

    private Long categoryId;

    private Long locationId; // Optional - for backwards compatibility

    private String city; // Free-text city input

    private String district; // Optional district/street info

    private List<String> imageUrls; // For simplicity, we create images from URLs
}
