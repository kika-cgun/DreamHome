package com.piotrcapecki.dreamhome.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MessageRequest {

    @NotBlank
    private String content;

    private Long listingId; // Needed when starting a new conversation
}
