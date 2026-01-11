package com.piotrcapecki.dreamhome.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ConversationResponse {
    private Long id;
    private Long listingId;
    private String listingTitle;
    private String listingImage;
    private UserResponse otherParticipant; // Buyer sees Seller, Seller sees Buyer
    private String lastMessage;
    private LocalDateTime lastMessageAt;
    private boolean hasUnreadMessages;
}
