package com.piotrcapecki.dreamhome.service;

import com.piotrcapecki.dreamhome.config.JwtService;
import com.piotrcapecki.dreamhome.dto.request.LoginRequest;
import com.piotrcapecki.dreamhome.dto.request.RegisterRequest;
import com.piotrcapecki.dreamhome.dto.response.AuthResponse;
import com.piotrcapecki.dreamhome.dto.response.UserResponse;
import com.piotrcapecki.dreamhome.entity.User;
import com.piotrcapecki.dreamhome.enums.Role;
import com.piotrcapecki.dreamhome.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;

        public AuthResponse register(RegisterRequest request) {
                if (userRepository.existsByEmail(request.getEmail())) {
                        throw new IllegalArgumentException("Email already in use");
                }

                User user = User.builder()
                                .firstName(request.getFirstName())
                                .lastName(request.getLastName())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .phone(request.getPhone())
                                .role(Role.USER) // Default role
                                .build();

                // If agency name is provided, assume AGENT role if logic permits, or stick to
                // USER.
                // For this project, let's allow simple self-declaration or default to USER.
                // Let's say if AgnecyName is present, we make them AGENT for simplicity of
                // demo.
                if (request.getAgencyName() != null && !request.getAgencyName().isBlank()) {
                        user.setRole(Role.AGENT);
                        user.setAgencyName(request.getAgencyName());
                }

                userRepository.save(user);

                // Auto-login after register? Or just return token?
                // Let's return token directly.
                // Need UserDetails for token generation.
                var jwtToken = jwtService.generateToken(new org.springframework.security.core.userdetails.User(
                                user.getEmail(),
                                user.getPassword(),
                                java.util.Collections.emptyList() // Authorities handling
                ));

                return AuthResponse.builder()
                                .token(jwtToken)
                                .user(UserResponse.builder()
                                                .id(user.getId())
                                                .email(user.getEmail())
                                                .firstName(user.getFirstName())
                                                .lastName(user.getLastName())
                                                .phone(user.getPhone())
                                                .role(user.getRole().name())
                                                .agencyName(user.getAgencyName())
                                                .build())
                                .build();
        }

        public AuthResponse login(LoginRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));
                var user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

                var jwtToken = jwtService.generateToken(new org.springframework.security.core.userdetails.User(
                                user.getEmail(),
                                user.getPassword(),
                                java.util.Collections.emptyList()));

                return AuthResponse.builder()
                                .token(jwtToken)
                                .user(UserResponse.builder()
                                                .id(user.getId())
                                                .email(user.getEmail())
                                                .firstName(user.getFirstName())
                                                .lastName(user.getLastName())
                                                .phone(user.getPhone())
                                                .role(user.getRole().name())
                                                .agencyName(user.getAgencyName())
                                                .build())
                                .build();
        }
}
