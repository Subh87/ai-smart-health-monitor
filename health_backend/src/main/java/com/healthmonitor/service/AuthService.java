package com.healthmonitor.service;

import com.healthmonitor.dto.AuthRequest;
import com.healthmonitor.dto.AuthResponse;
import com.healthmonitor.dto.RegisterRequest;
import com.healthmonitor.entity.UserEntity;
import com.healthmonitor.repository.UserRepository;
import com.healthmonitor.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("User with this email already exists.");
        }

        String deviceId = (request.getDeviceId() != null && !request.getDeviceId().isBlank())
                ? request.getDeviceId()
                : "ESP32-DEMO-001";

        UserEntity user = new UserEntity(
                request.getEmail().toLowerCase().trim(),
                passwordEncoder.encode(request.getPassword()),
                request.getName().trim(),
                deviceId
        );

        user = userRepository.save(user);

        String token = tokenProvider.generateToken(user.getEmail(), user.getId(), user.getDeviceId());
        AuthResponse.UserDto userDto = new AuthResponse.UserDto(user.getId(), user.getEmail(), user.getName(), user.getDeviceId());

        return new AuthResponse(token, userDto);
    }

    public AuthResponse login(AuthRequest request) {
        UserEntity user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password.");
        }

        String token = tokenProvider.generateToken(user.getEmail(), user.getId(), user.getDeviceId());
        AuthResponse.UserDto userDto = new AuthResponse.UserDto(user.getId(), user.getEmail(), user.getName(), user.getDeviceId());

        return new AuthResponse(token, userDto);
    }

    public AuthResponse.UserDto getUserByEmail(String email) {
        UserEntity user = userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        return new AuthResponse.UserDto(user.getId(), user.getEmail(), user.getName(), user.getDeviceId());
    }
}
