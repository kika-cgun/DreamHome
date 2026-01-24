package com.piotrcapecki.dreamhome.service;

import com.piotrcapecki.dreamhome.dto.response.ConversationResponse;
import com.piotrcapecki.dreamhome.dto.response.MessageResponse;
import com.piotrcapecki.dreamhome.dto.response.UserResponse;
import com.piotrcapecki.dreamhome.entity.Conversation;
import com.piotrcapecki.dreamhome.entity.Listing;
import com.piotrcapecki.dreamhome.entity.ListingImage;
import com.piotrcapecki.dreamhome.entity.Message;
import com.piotrcapecki.dreamhome.entity.User;
import com.piotrcapecki.dreamhome.exception.ResourceNotFoundException;
import com.piotrcapecki.dreamhome.repository.ConversationRepository;
import com.piotrcapecki.dreamhome.repository.ListingRepository;
import com.piotrcapecki.dreamhome.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConversationService {

        private final ConversationRepository conversationRepository;
        private final MessageRepository messageRepository;
        private final ListingRepository listingRepository;
        private final UserService userService;

        public ConversationResponse startConversation(Long listingId, String initialMessageContent) {
                User currentUser = userService.getCurrentUser();
                Listing listing = listingRepository.findById(listingId)
                                .orElseThrow(() -> new ResourceNotFoundException("Listing not found"));

                if (listing.getUser().getId().equals(currentUser.getId())) {
                        throw new IllegalArgumentException("Cannot start conversation with yourself");
                }

                Conversation conversation = conversationRepository
                                .findByListingIdAndBuyerId(listingId, currentUser.getId())
                                .orElseGet(() -> Conversation.builder()
                                                .listing(listing)
                                                .buyer(currentUser)
                                                .seller(listing.getUser())
                                                .build());

                // Save conversation if new
                if (conversation.getId() == null) {
                        conversation = conversationRepository.save(conversation);
                }

                // Add message
                Message message = Message.builder()
                                .conversation(conversation)
                                .sender(currentUser)
                                .content(initialMessageContent)
                                .isRead(false)
                                .build();
                messageRepository.save(message);

                return mapToConversationResponse(conversation, currentUser);
        }

        public List<ConversationResponse> getMyConversations() {
                User currentUser = userService.getCurrentUser();
                return conversationRepository.findByUserId(currentUser.getId()).stream()
                                .map(c -> mapToConversationResponse(c, currentUser))
                                .sorted(Comparator.comparing(ConversationResponse::getLastMessageAt).reversed())
                                .collect(Collectors.toList());
        }

        public List<MessageResponse> getMessages(Long conversationId) {
                User currentUser = userService.getCurrentUser();
                Conversation conversation = conversationRepository.findById(conversationId)
                                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));

                if (!conversation.getBuyer().getId().equals(currentUser.getId()) &&
                                !conversation.getSeller().getId().equals(currentUser.getId())) {
                        throw new IllegalArgumentException("Access denied");
                }

                return messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId).stream()
                                .map(m -> mapToMessageResponse(m, currentUser))
                                .collect(Collectors.toList());
        }

        public void markMessagesAsRead(Long conversationId) {
                User currentUser = userService.getCurrentUser();
                Conversation conversation = conversationRepository.findById(conversationId)
                                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));

                if (!conversation.getBuyer().getId().equals(currentUser.getId()) &&
                                !conversation.getSeller().getId().equals(currentUser.getId())) {
                        throw new IllegalArgumentException("Access denied");
                }

                // Mark all messages from OTHER user as read
                List<Message> unreadMessages = messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId)
                                .stream()
                                .filter(m -> !m.getSender().getId().equals(currentUser.getId()) && !m.isRead())
                                .collect(Collectors.toList());

                unreadMessages.forEach(m -> m.setRead(true));
                messageRepository.saveAll(unreadMessages);
        }

        public MessageResponse sendMessage(Long conversationId, String content) {
                User currentUser = userService.getCurrentUser();
                Conversation conversation = conversationRepository.findById(conversationId)
                                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));

                if (!conversation.getBuyer().getId().equals(currentUser.getId()) &&
                                !conversation.getSeller().getId().equals(currentUser.getId())) {
                        throw new IllegalArgumentException("Access denied");
                }

                Message message = Message.builder()
                                .conversation(conversation)
                                .sender(currentUser)
                                .content(content)
                                .isRead(false)
                                .build();
                Message saved = messageRepository.save(message);

                // Update conversation updatedAt
                // conversation.setUpdatedAt(LocalDateTime.now()); // Handled by
                // @UpdateTimestamp? Yes.
                // But we need to save conversation to trigger update? @UpdateTimestamp works on
                // update.
                // Adding a message doesn't necessarily update conversation entity unless we
                // touch it.
                // Let's touch it.
                // conversationRepository.save(conversation); // This might be needed if cascade
                // doesn't cover it or timestamp logic.
                // Actually since Message is owning side of relation, modifying message doesn't
                // touch Conversation.
                // We should manually update conversation timestamp or have a logic for it.
                // Hibernate's @UpdateTimestamp works when entity is updated.
                // We can force update.
                // conversation.setUpdatedAt(java.time.LocalDateTime.now());
                conversationRepository.save(conversation);

                return mapToMessageResponse(saved, currentUser);
        }

        private ConversationResponse mapToConversationResponse(Conversation c, User currentUser) {
                User otherUser = c.getBuyer().getId().equals(currentUser.getId()) ? c.getSeller() : c.getBuyer();

                // Find last message
                List<Message> messages = c.getMessages();
                // If messages not loaded (Lazy), this might trigger query.
                // Better: use repository to find last message or rely on list if fetched.
                // With basic mapping, list might be lazy.
                // Ideally we should use a query for list view, but for MVP:
                // Assume messages are fetched or small enough.

                String lastMsg = "";
                java.time.LocalDateTime lastTime = c.getUpdatedAt();
                boolean hasUnread = false;

                if (messages != null && !messages.isEmpty()) {
                        Message last = messages.get(messages.size() - 1);
                        lastMsg = last.getContent();
                        // Check unread: if any message from OTHER user is unread.
                        hasUnread = messages.stream()
                                        .anyMatch(m -> !m.getSender().getId().equals(currentUser.getId())
                                                        && !m.isRead());
                }

                String listingImage = null;
                if (c.getListing().getImages() != null && !c.getListing().getImages().isEmpty()) {
                        listingImage = c.getListing().getImages().stream()
                                        .filter(img -> Boolean.TRUE.equals(img.getIsPrimary()))
                                        .map(ListingImage::getImageUrl)
                                        .findFirst()
                                        .orElse(c.getListing().getImages().get(0).getImageUrl());
                }

                UserResponse otherUserDto = UserResponse.builder()
                                .id(otherUser.getId())
                                .firstName(otherUser.getFirstName())
                                .lastName(otherUser.getLastName())
                                .avatarUrl(otherUser.getAvatarUrl())
                                .build();

                return ConversationResponse.builder()
                                .id(c.getId())
                                .listingId(c.getListing().getId())
                                .listingTitle(c.getListing().getTitle())
                                .listingImage(listingImage)
                                .otherParticipant(otherUserDto)
                                .lastMessage(lastMsg)
                                .lastMessageAt(lastTime)
                                .hasUnreadMessages(hasUnread)
                                .build();
        }

        private MessageResponse mapToMessageResponse(Message m, User currentUser) {
                return MessageResponse.builder()
                                .id(m.getId())
                                .senderId(m.getSender().getId())
                                .senderName(m.getSender().getFirstName() + " " + m.getSender().getLastName())
                                .content(m.getContent())
                                .isRead(m.isRead())
                                .isMine(m.getSender().getId().equals(currentUser.getId()))
                                .createdAt(m.getCreatedAt())
                                .build();
        }
}
