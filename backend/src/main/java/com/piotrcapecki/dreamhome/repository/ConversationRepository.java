package com.piotrcapecki.dreamhome.repository;

import com.piotrcapecki.dreamhome.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    @Query("SELECT c FROM Conversation c WHERE c.buyer.id = :userId OR c.seller.id = :userId")
    List<Conversation> findByUserId(Long userId);

    Optional<Conversation> findByListingIdAndBuyerId(Long listingId, Long buyerId);
}
