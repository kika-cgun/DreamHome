package com.piotrcapecki.dreamhome.service;

import com.piotrcapecki.dreamhome.dto.response.UserResponse;
import com.piotrcapecki.dreamhome.entity.User;
import com.piotrcapecki.dreamhome.exception.ResourceNotFoundException;
import com.piotrcapecki.dreamhome.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResourceNotFoundException("No authenticated user found");
        }
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    public UserResponse getCurrentUserResponse() {
        User user = getCurrentUser();
        return mapToResponse(user);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .agencyName(user.getAgencyName())
                .role(user.getRole().name())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
