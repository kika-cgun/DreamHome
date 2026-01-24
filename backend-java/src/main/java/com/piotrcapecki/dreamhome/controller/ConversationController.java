package com.piotrcapecki.dreamhome.controller;

import com.piotrcapecki.dreamhome.dto.request.MessageRequest;
import com.piotrcapecki.dreamhome.dto.response.ConversationResponse;
import com.piotrcapecki.dreamhome.dto.response.MessageResponse;
import com.piotrcapecki.dreamhome.service.ConversationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conversations")
@RequiredArgsConstructor
public class ConversationController {

    private final ConversationService conversationService;

    @GetMapping
    public ResponseEntity<List<ConversationResponse>> getMyConversations() {
        return ResponseEntity.ok(conversationService.getMyConversations());
    }

    @PostMapping
    public ResponseEntity<ConversationResponse> startConversation(@Valid @RequestBody MessageRequest request) {
        // When starting conversation, we expect listingId in request
        if (request.getListingId() == null) {
            throw new IllegalArgumentException("Listing ID is required to start a conversation");
        }
        return ResponseEntity.ok(conversationService.startConversation(request.getListingId(), request.getContent()));
    }

    @GetMapping("/{id}/messages")
    public ResponseEntity<List<MessageResponse>> getMessages(@PathVariable Long id) {
        return ResponseEntity.ok(conversationService.getMessages(id));
    }

    @PostMapping("/{id}/messages")
    public ResponseEntity<MessageResponse> sendMessage(@PathVariable Long id,
            @Valid @RequestBody MessageRequest request) {
        return ResponseEntity.ok(conversationService.sendMessage(id, request.getContent()));
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        conversationService.markMessagesAsRead(id);
        return ResponseEntity.ok().build();
    }
}
