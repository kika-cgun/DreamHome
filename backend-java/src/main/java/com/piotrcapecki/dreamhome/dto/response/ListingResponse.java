package com.piotrcapecki.dreamhome.dto.response;

import com.piotrcapecki.dreamhome.enums.ListingStatus;
import com.piotrcapecki.dreamhome.enums.ListingType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ListingResponse {
    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private BigDecimal area;
    private Integer rooms;
    private String floor;
    private ListingType type;
    private ListingStatus status;
    private UserResponse user;
    private String category;
    private String city;
    private String district;
    private String primaryImage;
    private List<String> images;
    private LocalDateTime createdAt;
}
