package com.piotrcapecki.dreamhome.dto.request;

import com.piotrcapecki.dreamhome.enums.ListingType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ListingRequest {

    @NotBlank
    private String title;

    private String description;

    @NotNull
    @Min(0)
    private BigDecimal price;

    @NotNull
    @Min(0)
    private BigDecimal area;

    private Integer rooms;
    private String floor;

    @NotNull
    private ListingType type;

    @NotNull
    private Long categoryId;

    @NotNull
    private Long locationId;

    private List<String> imageUrls; // For simplicity, we create images from URLs
}
