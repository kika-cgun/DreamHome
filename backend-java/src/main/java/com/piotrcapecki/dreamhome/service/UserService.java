package com.piotrcapecki.dreamhome.service;

import com.piotrcapecki.dreamhome.dto.request.UserUpdateRequest;
import com.piotrcapecki.dreamhome.dto.response.UserResponse;
import com.piotrcapecki.dreamhome.entity.User;
import com.piotrcapecki.dreamhome.enums.Role;
import com.piotrcapecki.dreamhome.exception.ResourceNotFoundException;
import com.piotrcapecki.dreamhome.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

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

    public UserResponse updateCurrentUser(UserUpdateRequest request) {
        User currentUser = getCurrentUser();

        // Update fields if provided
        if (request.getFirstName() != null) {
            currentUser.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            currentUser.setLastName(request.getLastName());
        }
        if (request.getPhone() != null) {
            currentUser.setPhone(request.getPhone());
        }
        if (request.getAvatarUrl() != null) {
            currentUser.setAvatarUrl(request.getAvatarUrl());
        }
        if (request.getAgencyName() != null) {
            currentUser.setAgencyName(request.getAgencyName());
        }

        User updatedUser = userRepository.save(currentUser);
        return mapToResponse(updatedUser);
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public UserResponse updateUserRole(Long userId, String roleName) {
        User currentUser = getCurrentUser();

        // Prevent admin from changing own role
        if (currentUser.getId().equals(userId)) {
            throw new IllegalArgumentException("Cannot change your own role");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Role newRole = Role.valueOf(roleName);
        user.setRole(newRole);
        User updatedUser = userRepository.save(user);
        return mapToResponse(updatedUser);
    }

    public void deleteUser(Long userId) {
        User currentUser = getCurrentUser();

        // Prevent admin from deleting themselves
        if (currentUser.getId().equals(userId)) {
            throw new IllegalArgumentException("Cannot delete your own account");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        userRepository.delete(user);
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
