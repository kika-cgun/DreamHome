package com.piotrcapecki.dreamhome.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MessageResponse {
    private Long id;
    private Long senderId;
    private String senderName; // E.g. "John Doe"
    private String content;
    @JsonProperty("isRead")
    private boolean isRead;
    @JsonProperty("isMine")
    private boolean isMine; // Helper for frontend styling
    private LocalDateTime createdAt;
}
